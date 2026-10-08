import "./receipt.css";

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigitWords(num) {
  if (num < 20) return ONES[num];

  const tens = Math.floor(num / 10);
  const ones = num % 10;

  return `${TENS[tens]}${ones ? ` ${ONES[ones]}` : ""}`;
}

function threeDigitWords(num) {
  if (num < 100) {
    return twoDigitWords(num);
  }

  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  return `${ONES[hundreds]} Hundred${
    remainder ? ` ${twoDigitWords(remainder)}` : ""
  }`;
}

function indianNumberToWords(value) {
  const num = Math.floor(Number(value) || 0);

  if (num === 0) {
    return "Zero";
  }

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  const parts = [];

  if (crore) {
    parts.push(`${threeDigitWords(crore)} Crore`);
  }

  if (lakh) {
    parts.push(`${twoDigitWords(lakh)} Lakh`);
  }

  if (thousand) {
    parts.push(`${twoDigitWords(thousand)} Thousand`);
  }

  if (remainder) {
    if (parts.length > 0) {
      parts.push(`and ${threeDigitWords(remainder)}`);
    } else {
      parts.push(threeDigitWords(remainder));
    }
  }

  return parts.join(" ");
}

function formatAmount(value) {
  const number = Number(value) || 0;

  return number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

export default function MoneyReceiptTemplate({ data = {} }) {
  const paymentMode = data.paymentMode || "UPI";

  const numericAmount = Number(data.amount || 0);

  const amount = formatAmount(numericAmount);

  const amountWords =
    data.amountWords?.trim() || indianNumberToWords(numericAmount);

  const paymentDate = data.paymentDate || data.date || "";

  const receiptNo = data.receiptNo || "";

  const name = data.name || "";

  const projectName =
    data.projectName || "Signature Associate Membership Program";

  const transactionId = data.transactionId || "";

  const paymentModes = ["UPI", "NEFT", "IMPS", "Cash", "Cheque", "Other"];

  return (
    <div id="receipt" className="money-receipt">
      {/* =========================================================
          TOP BRAND STRIP
          ========================================================= */}

      <div className="receipt-top-strip">
        <div className="receipt-top-navy" />
        <div className="receipt-top-gold" />
      </div>

      {/* =========================================================
          HEADER
          ========================================================= */}

      <header className="receipt-header">
        {/* Logo */}
        <div className="receipt-brand">
          <img
            src="/logo.jpeg"
            alt="Signature Associates"
            className="receipt-logo"
          />

          <div className="receipt-tagline">
            REAL ESTATE
            <span>|</span>
            INVESTMENT
            <span>|</span>
            TOGETHER FOR A BETTER TOMORROW
          </div>
        </div>

        {/* Heading */}
        <div className="receipt-heading">
          <h1>
            PAYMENT <span>RECEIPT</span>
          </h1>

          <div className="receipt-subtitle">ASSOCIATE MEMBERSHIP PROGRAM</div>

          <div className="receipt-title-line" />
        </div>

        {/* Empty right side intentionally.
            The reference image does not contain a registered-office block. */}
        <div className="receipt-header-spacer" />
      </header>

      {/* =========================================================
          RECEIPT META
          ========================================================= */}

      <div className="receipt-meta-row">
        <div className="receipt-meta-item">
          <strong>Receipt No.</strong>
          <span>{receiptNo}</span>
        </div>

        <div className="receipt-meta-item receipt-meta-date">
          <strong>Date</strong>
          <span>{paymentDate}</span>
        </div>
      </div>

      {/* Orange divider */}
      <div className="receipt-divider" />

      {/* =========================================================
          MAIN RECEIPT INFORMATION
          ========================================================= */}

      <section className="receipt-body">
        {/* Received From */}
        <div className="receipt-row">
          <div className="receipt-label">Received with thanks from</div>

          <div className="receipt-colon">:</div>

          <div className="receipt-value">{name}</div>
        </div>

        {/* Amount */}
        <div className="receipt-row">
          <div className="receipt-label">Amount</div>

          <div className="receipt-colon">:</div>

          <div className="receipt-value amount-value">
            <span className="rupee-symbol">₹</span>

            <strong>{amount}/-</strong>
          </div>
        </div>

        {/* Amount in words */}
        <div className="receipt-row">
          <div className="receipt-label">In words</div>

          <div className="receipt-colon">:</div>

          <div className="receipt-value">{amountWords} Only.</div>
        </div>

        {/* For */}
        <div className="receipt-row">
          <div className="receipt-label">For</div>

          <div className="receipt-colon">:</div>

          <div className="receipt-value">
            Associate Membership Fee for {projectName}
          </div>
        </div>

        {/* Payment Mode */}
        <div className="receipt-row payment-mode-row">
          <div className="receipt-label">Mode of Payment</div>

          <div className="receipt-colon">:</div>

          <div className="payment-options">
            {paymentModes.map((mode) => {
              const isSelected =
                paymentMode.toLowerCase() === mode.toLowerCase();

              return (
                <span className="payment-option" key={mode}>
                  <span
                    className={`payment-checkbox ${
                      isSelected ? "checked" : ""
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>

                  {mode}
                </span>
              );
            })}
          </div>
        </div>

        {/* Transaction + Payment Date */}
        <div className="receipt-row transaction-row">
          <div className="receipt-label">Transaction ID / UTR No.</div>

          <div className="receipt-colon">:</div>

          <div className="receipt-value transaction-value">{transactionId}</div>

          <div className="payment-date-label">Payment Date</div>

          <div className="receipt-colon payment-date-colon">:</div>

          <div className="receipt-value payment-date-value">{paymentDate}</div>
        </div>
      </section>

      {/* =========================================================
          LEGAL NOTE
          ========================================================= */}

      <section className="receipt-legal-note">
        The amount received is towards the Signature Associate Membership
        Program and shall not be treated as a Fixed Deposit, Investment Scheme,
        Loan Arrangement, Financial Product, Profit-Sharing Arrangement, or
        Interest-Bearing Instrument. Membership benefits and adjustments shall
        be governed by the company&apos;s prevailing policies and terms &amp;
        conditions.
      </section>

      {/* Computer generated note */}
      <div className="receipt-generated-note">
        This is a computer generated receipt, hence no signature is required.
      </div>

      {/* =========================================================
          FOOTER
          ========================================================= */}

      <footer className="receipt-footer">
        <div className="footer-navy" />
        <div className="footer-gold" />

        <div className="footer-text">TOGETHER FOR A BRIGHTER TOMORROW</div>
      </footer>
    </div>
  );
}
