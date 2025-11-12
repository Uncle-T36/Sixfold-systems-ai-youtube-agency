# Stripe Setup Instructions
## Connect Your Bank Account & Start Receiving Payments

### Overview
This app uses Stripe for secure payment processing. Your banking details stay 100% private in Stripe's secure dashboard. Users never see your bank account or revenue numbers.

---

## Step 1: Create Stripe Account (Free)

1. Go to: https://dashboard.stripe.com/register
2. Sign up with your email: **tchafuruka@gmail.com**
3. Verify your email address
4. Complete business profile:
   - Business name: **SixFold Systems** (or your business name)
   - Country: **South Africa** (+27 phone number)
   - Business type: **Software as a Service (SaaS)**

---

## Step 2: Add Your Banking Details (Private & Secure)

1. In Stripe Dashboard, go to: **Settings** → **Bank accounts and scheduling**
2. Click **Add bank account**
3. Enter your banking details:
   - Bank name
   - Account number
   - Branch code
   - Account holder name: **Your Name**
   
**🔒 SECURITY: Your banking details are ONLY stored in Stripe's secure vault. They are NEVER visible in this app's code or to users.**

---

## Step 3: Create Subscription Products

1. In Stripe Dashboard, go to: **Products** → **Add Product**

### Create 3 Products:

#### Product 1: Starter Plan
- Name: **AI YouTube Agency - Starter**
- Price: **$49/month** (or R890/month)
- Recurring billing: **Monthly**
- Copy the **Price ID** (looks like: `price_xxxxxxxxxxxxx`)

#### Product 2: Professional Plan (Most Popular)
- Name: **AI YouTube Agency - Professional**
- Price: **$99/month** (or R1,800/month)
- Recurring billing: **Monthly**
- Copy the **Price ID**

#### Product 3: Enterprise Plan
- Name: **AI YouTube Agency - Enterprise**
- Price: **$299/month** (or R5,400/month)
- Recurring billing: **Monthly**
- Copy the **Price ID**

---

## Step 4: Get Your API Keys

1. In Stripe Dashboard, go to: **Developers** → **API keys**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_live_` or `pk_test_`)
   - **Secret key** (starts with `sk_live_` or `sk_test_`)

**⚠️ IMPORTANT:**
- Start with **Test mode** keys for testing
- Switch to **Live mode** keys when ready to accept real payments
- NEVER share your secret key publicly!

---

## Step 5: Add Keys to Your App

1. Open the file: `.env.local` in your project
2. Add these environment variables:

```env
# Stripe Keys (Owner Only - Never Share!)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Product Price IDs (from Step 3)
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_xxxxxxxxxxxxx

# Owner Dashboard Password (Change this!)
NEXT_PUBLIC_OWNER_PASSWORD=YourSecurePassword123!
```

3. Save the file
4. Restart your development server: `npm run dev`

---

## Step 6: Install Stripe SDK

Run this command in your terminal:

```bash
npm install stripe @stripe/stripe-js
```

---

## Step 7: Test Payments (Test Mode)

1. Go to your pricing page: http://localhost:3000/pricing
2. Click "Subscribe" on any plan
3. Use Stripe's test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

4. Complete the test payment
5. Check Stripe Dashboard → **Payments** to see the test transaction

---

## Step 8: Go Live (Accept Real Money)

1. In Stripe Dashboard, complete business verification:
   - Identity verification (ID/Passport)
   - Business documents (if required)
   - Bank account verification

2. Switch API keys from **Test mode** to **Live mode**:
   - Update `.env.local` with `sk_live_` and `pk_live_` keys
   
3. Update product price IDs to live versions

4. Deploy to production: `vercel --prod`

5. ✅ **You're now accepting real payments!**

---

## Step 9: View Your Revenue (Owner Only)

### In This App:
1. Go to: http://localhost:3000/owner-revenue
2. Enter your owner password (set in `.env.local`)
3. View:
   - Total revenue
   - Monthly recurring revenue
   - Active subscribers
   - Growth metrics

### In Stripe Dashboard:
1. Go to: https://dashboard.stripe.com
2. View detailed transactions
3. Manage payouts to your bank account
4. Download tax reports

**🔐 SECURITY REMINDER:**
- Users NEVER see this revenue page
- Your banking details NEVER appear in app code
- Only you can access the owner dashboard
- Stripe handles all payment security (PCI compliant)

---

## Payment Flow (How It Works)

```
User clicks "Subscribe"
    ↓
Redirects to Stripe secure checkout page
    ↓
User enters payment details (NEVER touches your app)
    ↓
Stripe processes payment
    ↓
Money goes to YOUR bank account
    ↓
User gets access to app features
    ↓
You see revenue in Stripe Dashboard + Owner Revenue page
```

---

## Payout Schedule

- **Default**: Stripe pays out to your bank account every 2 days
- **Customizable**: Go to Stripe Dashboard → Settings → Payout schedule
- **Options**:
  - Daily payouts
  - Weekly payouts
  - Monthly payouts
  - Manual payouts (you control when)

---

## Security Best Practices

✅ **DO:**
- Keep `STRIPE_SECRET_KEY` in `.env.local` (never commit to GitHub)
- Use strong owner password
- Enable 2-factor authentication in Stripe
- Regularly check Stripe Dashboard for suspicious activity
- Use test mode for development

❌ **DON'T:**
- Share your secret API keys
- Commit `.env.local` to GitHub
- Share owner dashboard password
- Use live keys in development

---

## Support

**Stripe Support:**
- Dashboard: https://dashboard.stripe.com
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

**App Support:**
- Email: tchafuruka@gmail.com
- Phone: +27 74 941 5020

---

## Compliance & Taxes

### South Africa:
- Stripe supports ZAR (South African Rand)
- Payouts go to South African bank accounts
- You're responsible for reporting income to SARS
- Stripe provides transaction reports for tax filing

### Tax Reports:
1. Stripe Dashboard → **Reports**
2. Download monthly/yearly summaries
3. Give to your accountant or use for SARS filing

---

## FAQ

**Q: When will I receive payouts?**
A: 2 days after customer payment (default). Customizable in Stripe settings.

**Q: What fees does Stripe charge?**
A: ~2.9% + 30¢ per transaction (standard for South Africa)

**Q: Can customers see my bank account?**
A: NO. Your banking details are 100% private in Stripe.

**Q: How do I refund a customer?**
A: Stripe Dashboard → Payments → Select payment → Refund

**Q: What if a payment fails?**
A: Stripe automatically retries failed payments and notifies the customer.

**Q: Can I use multiple currencies?**
A: Yes! Stripe supports USD, EUR, GBP, ZAR, and 135+ currencies.

---

## Ready to Make Money! 🚀

Once setup is complete:
1. Users subscribe via Stripe checkout
2. Money lands in YOUR bank account
3. Track revenue in owner dashboard
4. Scale to thousands of subscribers
5. Automated payments = passive income

**Your banking details stay private. Your code stays secure. Your wealth grows automatically.**
