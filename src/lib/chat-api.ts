export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// TODO: Connect this function to the Python backend API.
// Replace the mock implementation below with an actual fetch call to your backend.
// Example:
// const response = await fetch('https://your-api.com/chat', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ prompt }),
// });
// return response.json();

export async function handleSendMessage(prompt: string): Promise<string> {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock responses based on keywords
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('women') || lowerPrompt.includes('safety') || lowerPrompt.includes('பெண்')) {
    return `**Women's Safety Resources in Tamil Nadu**

Here are key resources and rights you should know:

1. **Emergency Helpline**: Call **181** (Women Helpline) available 24/7
2. **Police Emergency**: **100** or **112**

**Your Legal Rights:**
- **Domestic Violence Act**: Protection from physical, emotional, and economic abuse
- **Sexual Harassment at Workplace Act**: Every employer must have an Internal Complaints Committee
- **Free Legal Aid**: Available at District Legal Services Authority

**Key Schemes:**
- **Moovalur Ramamirtham Scheme**: Financial assistance for girls' education
- **Marriage Assistance Scheme**: ₹50,000 for eligible women

Would you like more details on any specific topic?`;
  }

  if (lowerPrompt.includes('scheme') || lowerPrompt.includes('welfare') || lowerPrompt.includes('திட்டம்')) {
    return `**Tamil Nadu Welfare Schemes**

Here are some key government schemes you may be eligible for:

**For Students:**
- **Free Bus Pass**: For school and college students
- **Laptop Scheme**: Free laptops for +2 and college students

**For Families:**
- **Kalaignar Health Insurance**: Up to ₹5 lakh medical coverage
- **Amma Unavagam**: Subsidized meals at ₹5

**For Farmers:**
- **Crop Insurance Scheme**: Protection against crop failure
- **Free Electricity**: For agricultural pump sets

**Eligibility Criteria:**
- Most schemes require a **Family Card** (Ration Card)
- Income limits apply for some schemes
- Valid **Aadhaar** documentation needed

Shall I explain the application process for any specific scheme?`;
  }

  if (lowerPrompt.includes('law') || lowerPrompt.includes('legal') || lowerPrompt.includes('right') || lowerPrompt.includes('சட்டம்')) {
    return `**Understanding Your Legal Rights**

Every citizen has fundamental rights under the Indian Constitution:

**Key Rights:**
- **Right to Equality** (Article 14-18)
- **Right to Freedom** (Article 19-22)
- **Right against Exploitation** (Article 23-24)
- **Right to Constitutional Remedies** (Article 32)

**Free Legal Help:**
- **District Legal Services Authority**: Free legal aid for eligible citizens
- **Lok Adalat**: Quick dispute resolution without court fees
- **Legal Aid Clinic**: Available in every Taluk

**How to File a Complaint:**
1. Visit your nearest **Police Station**
2. File at **e-Sevai Center** for certain matters
3. Approach **Consumer Forum** for consumer issues

What specific legal matter would you like guidance on?`;
  }

  // Default response
  return `Thank you for your question. I'm here to help you understand:

- **Legal Rights**: Your constitutional and statutory rights
- **Women's Safety**: Emergency contacts, laws, and support services
- **Welfare Schemes**: Government benefits you may be eligible for

Please ask about any specific topic, and I'll provide detailed information in English or Tamil.

**Quick Tips:**
- Use the 🎤 microphone button to speak your question
- You can ask in Tamil or English
- Be specific for more accurate information`;
}
