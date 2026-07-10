import rateLimit from '@fastify/rate-limit';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { queueContactSubmission } from '../dev/contact-outbox.js';
import { queueDevelopmentEmail } from '../dev/email-outbox.js';
import { env } from '../config/env.js';

const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(320),
  message: z.string().trim().min(20).max(4000),
  website: z.string().trim().max(200).optional(),
});

const contactAdminEmails = env.CONTACT_ADMIN_EMAILS.split(',')
  .map((email) => email.trim())
  .filter(Boolean);
const contactFallbackAdminEmail = 'gatekeeper@justsow.org';
const contactNotificationRecipients = [
  ...contactAdminEmails,
  ...(contactAdminEmails.length === 0 ? [contactFallbackAdminEmail] : []),
];

export const contactRoutes: FastifyPluginAsync = async (app) => {
  void app.register(rateLimit, {
    global: false,
  });

  app.post(
    '/api/contact',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const parsed = contactSubmissionSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({
          error: 'INVALID_CONTACT_SUBMISSION',
          message: 'Check the form fields and try again.',
        });
      }

      const body = parsed.data;

      if (body.website?.trim()) {
        return reply.code(200).send({
          status: true,
        });
      }

      const submission = await queueContactSubmission({
        name: body.name,
        email: body.email,
        subject: `Contact enquiry from ${body.name}`,
        message: body.message,
        ipAddress: request.ip,
        userAgent:
          typeof request.headers['user-agent'] === 'string'
            ? request.headers['user-agent']
            : null,
      });

      await queueDevelopmentEmail({
        kind: 'contact_acknowledgement',
        email: body.email,
        subject: 'We got your message',
        text: `Hi ${body.name},\n\nWe got your message and will reply soon.\n\nThanks,\nJustSow`,
        replyTo: contactNotificationRecipients[0] ?? contactFallbackAdminEmail,
      });

      const adminRecipient = contactNotificationRecipients[0];

      if (adminRecipient) {
        await queueDevelopmentEmail({
          kind: 'contact_notification',
          email: adminRecipient,
          recipients: contactNotificationRecipients,
          subject: `New contact message from ${body.name}`,
          text: [
            `Name: ${body.name}`,
            `Email: ${body.email}`,
            '',
            'Message:',
            body.message,
          ].join('\n'),
          replyTo: body.email,
        });
      }

      return reply.code(201).send({
        status: true,
        submissionId: submission.id,
      });
    }
  );
};
