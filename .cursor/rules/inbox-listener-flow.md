# Gmail Inbox Listener Implementation Guide

## Overview

The Gmail Inbox Listener is a feature that allows business users to connect their Gmail accounts and automatically process incoming emails with document attachments. This system is designed for Cloudflare Workers (serverless environment) and uses Google Cloud Pub/Sub for real-time notifications.

## Architecture Overview

```
User Gmail Account → Gmail API → Google Cloud Pub/Sub → Cloudflare Worker → Database
                                                                         ↓
                                                              Document Processing
```

## Key Components

### 1. Database Schema

**Tables created in `apps/server/src/db/schema/gmail.ts`:**

- `gmailAccount`: Stores OAuth credentials for connected Gmail accounts
- `inboxListener`: Configuration for each business inbox being monitored  
- `emailProcessingLog`: Audit trail of processed emails and their attachments

### 2. Server Implementation

**Router: `apps/server/src/routers/gmail.ts`**

Key endpoints:
- `linkInbox`: Initiates Gmail OAuth flow for account linking
- `handleEmailWebhook`: Processes incoming Gmail push notifications
- `getInboxListeners`: Returns user's configured inbox listeners
- `removeInboxListener`: Removes and cleans up inbox listeners

### 3. Authentication & Authorization

**Enhanced `apps/server/src/lib/auth.ts`:**
- Added Google OAuth provider to better-auth
- Configured Gmail API scopes:
  - `https://www.googleapis.com/auth/gmail.readonly`
  - `https://www.googleapis.com/auth/gmail.modify`

### 4. Frontend Components

**Component: `apps/web/src/components/LinkInboxButton.tsx`**
- React component for initiating Gmail account linking
- Handles OAuth flow initiation and user feedback

**Updated: `apps/web/src/routes/dashboard.tsx`**
- Integrated inbox management UI
- Displays connected inboxes and recent activity

## Gmail Inbox Listener Flow

### Initial Setup Flow

1. **User Action**: User clicks "Link Gmail Inbox" button in dashboard
2. **OAuth Initiation**: Frontend calls `linkInbox` endpoint
3. **OAuth Redirect**: Server generates Google OAuth URL with required scopes
4. **Google Authorization**: User authorizes app access to Gmail
5. **Token Exchange**: Server exchanges authorization code for access/refresh tokens
6. **Account Storage**: Gmail account credentials stored in `gmailAccount` table
7. **Pub/Sub Setup**: Google Cloud Pub/Sub topic and subscription created
8. **Gmail Watch**: Gmail API watch request set up for the inbox
9. **Listener Creation**: `inboxListener` record created with configuration

### Real-time Email Processing Flow

1. **Email Received**: Client sends email to business inbox (e.g., docs@swiftbooks.cloud)
2. **Gmail Notification**: Gmail sends push notification to Pub/Sub topic
3. **Webhook Trigger**: Cloudflare Worker receives Pub/Sub message
4. **Message Processing**: Worker decodes notification and extracts historyId
5. **Gmail API Call**: Fetch new messages using Gmail API with historyId
6. **Document Detection**: Check for document attachments (PDF, DOCX, etc.)
7. **Processing Logic**: Extract and process document attachments
8. **Audit Logging**: Record processing results in `emailProcessingLog`

## Environment Variables Required

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gmail Push Notifications
GMAIL_PUBSUB_TOPIC=your-pubsub-topic
GMAIL_PUBSUB_SUBSCRIPTION=your-pubsub-subscription

# Better Auth (existing)
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=your-base-url
```

## Google Cloud Setup Requirements

### 1. OAuth 2.0 Client Configuration

1. **Google Cloud Console** → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. **Authorized JavaScript Origins**: Your app domain
4. **Authorized Redirect URIs**: `{BASE_URL}/api/gmail/callback`
5. **Scopes Required**:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.modify`

### 2. Pub/Sub Topic & Subscription

1. **Create Topic**: `gmail-push-notifications`
2. **Create Subscription**: Push subscription pointing to worker webhook
3. **IAM Permissions**: Grant `gmail-api-push@system.gserviceaccount.com` publisher role
4. **Webhook URL**: `{WORKER_URL}/api/gmail/webhook`

### 3. Gmail API Setup

1. **Enable Gmail API** in Google Cloud Console
2. **Configure Domain Verification** for your worker domain
3. **Set Up Push Notifications**:
   ```json
   {
     "topicName": "projects/{PROJECT_ID}/topics/gmail-push-notifications",
     "labelIds": ["INBOX"]
   }
   ```

## Cloudflare Workers Considerations

### No Polling Allowed
- Gmail push notifications via Pub/Sub are essential
- Cannot use interval-based polling in serverless environment
- All processing must be event-driven

### Environment Variables Access
```typescript
import { env } from "cloudflare:workers";
// Access variables: env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET
```

### Bindings Configuration
Add to `wrangler.jsonc`:
```json
{
  "vars": {
    "GOOGLE_CLIENT_ID": "your-client-id",
    "GOOGLE_CLIENT_SECRET": "your-client-secret"
  }
}
```

## Security Considerations

### OAuth Token Management
- **Access Tokens**: Short-lived (1 hour), stored in database
- **Refresh Tokens**: Long-lived, used to obtain new access tokens
- **Token Refresh**: Automatic renewal before expiration
- **Scope Limitation**: Only request necessary Gmail scopes

### Data Privacy
- **Minimal Data Storage**: Only store necessary metadata
- **Encryption**: Sensitive tokens should be encrypted at rest
- **Access Control**: User-based access to inbox configurations
- **Audit Trail**: Complete logging of email processing activities

## Error Handling & Monitoring

### Common Error Scenarios
1. **OAuth Token Expiration**: Automatic refresh or re-authentication prompt
2. **Gmail API Rate Limits**: Exponential backoff and retry logic
3. **Pub/Sub Message Delivery Failures**: Dead letter queue handling
4. **Network Timeouts**: Graceful degradation and retry mechanisms

### Monitoring Points
- Gmail watch expiration (renew every 7 days)
- Token refresh failures
- Email processing errors
- Pub/Sub subscription health

## Implementation Status

### ✅ Completed
- Database schema design
- Server router structure  
- Basic OAuth flow setup
- Frontend UI components
- Environment variable configuration

### 🔄 TODO (Implementation Gaps)
- Complete OAuth callback handler
- Gmail API integration for message fetching
- Pub/Sub webhook processing logic
- Document attachment extraction
- Database operations (CRUD)
- Error handling and retry logic
- Gmail watch renewal automation
- Token refresh mechanism

## Future Agent Guidelines

When working on this codebase:

1. **Always use serverless patterns** - No polling, use event-driven architecture
2. **Handle token expiration gracefully** - Implement refresh logic
3. **Respect Gmail API limits** - Use exponential backoff
4. **Maintain audit trails** - Log all email processing activities
5. **Follow security best practices** - Encrypt sensitive data, validate inputs
6. **Test OAuth flow thoroughly** - Ensure proper error handling
7. **Monitor Pub/Sub health** - Set up alerting for failed deliveries
8. **Document any changes** - Update this guide when modifying the flow

## Useful Resources

- [Gmail API Push Notifications](https://developers.google.com/gmail/api/guides/push)
- [Google Cloud Pub/Sub](https://cloud.google.com/pubsub/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Gmail API Scopes](https://developers.google.com/identity/protocols/oauth2/scopes#gmail)