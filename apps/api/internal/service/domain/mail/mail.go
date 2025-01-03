package mail

import (
	"fundlevel/internal/service/domain/mail/ses"

	"github.com/aws/aws-sdk-go/aws/session"
)

type MailService struct {
	sesClient *ses.Client
}

// NewTestService returns a new instance of test service.
func NewMailService(session *session.Session, defaultSender string) *MailService {
	return &MailService{
		sesClient: ses.NewClient(session, defaultSender),
	}
}

func (s *MailService) SendEmail(opts ...ses.EmailOptFunc) error {
	return s.sesClient.Send(opts...)
}
