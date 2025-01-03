package ses

import (
	"errors"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type Client struct {
	ses           *ses.SES
	defaultSender string
}

type ClientOptFunc func(*Client)

func NewClient(session *session.Session, defaultSender string) (*Client) {
	return &Client{
		ses:           ses.New(session),
		defaultSender: defaultSender,
	}
}

// Email represents an email to be sent
type Email struct {
	To       []string
	CC       []string
	From     string
	Subject  string
	HTMLBody string
	TextBody string
	CharSet  string
}

type EmailOptFunc func(*Email)

func WithRecipients(to []string) EmailOptFunc {
	return func(e *Email) {
		e.To = to
	}
}

func WithCC(cc []string) EmailOptFunc {
	return func(e *Email) {
		e.CC = cc
	}
}

func WithSender(from string) EmailOptFunc {
	return func(e *Email) {
		e.From = from
	}
}

func WithSubject(subject string) EmailOptFunc {
	return func(e *Email) {
		e.Subject = subject
	}
}

func WithHTMLBody(htmlBody string) EmailOptFunc {
	return func(e *Email) {
		e.HTMLBody = htmlBody
	}
}

func WithTextBody(textBody string) EmailOptFunc {
	return func(e *Email) {
		e.TextBody = textBody
	}
}

func WithCharSet(charSet string) EmailOptFunc {
	return func(e *Email) {
		e.CharSet = charSet
	}
}

func (s *Client) Send(opts ...EmailOptFunc) error {
	email := &Email{
		From:     s.defaultSender,
		To:       []string{s.defaultSender},
		CC:       []string{s.defaultSender},
		Subject:  "",
		HTMLBody: "",
		TextBody: "",
		CharSet:  "UTF-8",
	}

	for _, opt := range opts {
		opt(email)
	}

	recipients := make([]*string, len(email.To))
	for i, to := range email.To {
		recipients[i] = aws.String(to)
	}

	ccs := make([]*string, len(email.CC))
	for i, cc := range email.CC {
		ccs[i] = aws.String(cc)
	}

	// Assemble the email.
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			CcAddresses: ccs,
			ToAddresses: recipients,
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String(email.CharSet),
					Data:    aws.String(email.HTMLBody),
				},
				Text: &ses.Content{
					Charset: aws.String(email.CharSet),
					Data:    aws.String(email.TextBody),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String(email.CharSet),
				Data:    aws.String(email.Subject),
			},
		},
		Source: aws.String(email.From),
	}

	// Attempt to send the email.
	_, err := s.ses.SendEmail(input)

	// Display error messages if they occur.
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case ses.ErrCodeMessageRejected:
				return errors.New("message rejected")
			case ses.ErrCodeMailFromDomainNotVerifiedException:
				return errors.New("mail from domain not verified")
			case ses.ErrCodeConfigurationSetDoesNotExistException:
				return errors.New("configuration set does not exist")
			default:
				return errors.New(aerr.Error())
			}
		} else {
			// Print the error, cast err to awserr.Error to get the Code and
			// Message from an error.
			return errors.New(err.Error())
		}

	}
	return nil
}
