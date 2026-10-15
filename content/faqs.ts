/**
 * FREQUENTLY ASKED QUESTIONS
 *
 * Questions are grouped. Each answer may have several paragraphs.
 * Answers must not promise anything that has not been approved.
 */

export interface Faq {
  question: string;
  answer: string[];
}

export interface FaqGroup {
  group: string;
  items: Faq[];
}

export const faqIntro = {
  heading: 'Frequently Asked Questions',
  lead: 'Answers will be updated as details are confirmed.',
};

export const faqGroups: FaqGroup[] = [
  {
    group: 'Eligibility',
    items: [
      {
        question: 'Who can submit a paper to GIMDC 2027?',
        answer: ['GIMDC 2027 is a doctoral research conference. Detailed eligibility criteria will be set out in the official Call for Papers.'],
      },
      {
        question: 'Can faculty members participate?',
        answer: ['The proposed programme includes a faculty / paper development workshop and a panel discussion with faculty participation. Participation details will be announced with the programme.'],
      },
    ],
  },
  {
    group: 'Submission',
    items: [
      {
        question: 'How do I submit a paper?',
        answer: ['Submissions will be accepted through an official submission portal, which will be linked from this website when it opens. Please do not send papers by email unless the Call for Papers asks you to.'],
      },
      {
        question: 'What is the submission deadline?',
        answer: ['The proposed submission deadline is 5 January 2027, with an extended / final deadline of 20 January 2027. These dates are subject to confirmation.'],
      },
      {
        question: 'Which track should I choose?',
        answer: ['Choose the track whose boundary your research most directly crosses. Each track page lists its key areas. Further guidance will be provided in the Call for Papers.'],
      },
    ],
  },
  {
    group: 'Registration',
    items: [
      {
        question: 'How much is the registration fee?',
        answer: ['The proposed registration fee is ₹5,000, stated as inclusive of GST. The final fee will be confirmed before registration opens.'],
      },
      {
        question: 'Can I pay online now?',
        answer: ['Not yet. Online payment will be available only after the official payment facility is approved and activated. This website does not currently collect any payment or personal information.'],
      },
      {
        question: 'When does registration open?',
        answer: ['Registration is proposed to open on 1 February 2027 and close on 1 March 2027.'],
      },
    ],
  },
  {
    group: 'Accommodation',
    items: [
      {
        question: 'Is accommodation available?',
        answer: ['Accommodation is proposed at ₹800 per night including meals. Availability and booking arrangements will be confirmed before registration opens.'],
      },
    ],
  },
  {
    group: 'Certificates',
    items: [
      {
        question: 'Will participants receive certificates?',
        answer: ['Details about participation and presentation certificates will be confirmed with the final programme.'],
      },
    ],
  },
];
