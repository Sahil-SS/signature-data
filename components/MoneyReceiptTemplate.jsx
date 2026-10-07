import "./receipt.css";

const MODES = ["UPI", "NEFT", "IMPS", "Cash", "Other"];

function formatAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("en-IN") : value;
}

export default function MoneyReceiptTemplate({ data }) {
  const paymentMode = String(data?.paymentMode || "UPI");
  const amount = formatAmount(data?.amount || "0");
  const amountWords = data?.amountWords || "";
  const paymentDate = data?.paymentDate || data?.date || "";
  const receiptNo = data?.receiptNo || "";
  const name = data?.name || "";
  const branch = data?.branch || "";
  const projectName = data?.projectName || "";
  const transactionId = data?.transactionId || "";

  // Anything that is not UPI / NEFT / IMPS / Cash is treated as "Other"
  const knownModes = ["upi", "neft", "imps", "cash"];
  const normalized = paymentMode.toLowerCase();
  const selectedMode = knownModes.includes(normalized) ? normalized : "other";

  return (
    <div id="receipt" className="money-receipt">
      {/* ================= TOP STRIP ================= */}
      <svg
        className="mr-top-strip"
        viewBox="0 0 277 9.5"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 93.5,0 86,9.5 0,9.5" fill="#07355b" />
        <polygon points="99.5,0 277,0 277,9.5 91,9.5" fill="#f5a000" />
      </svg>

      {/* ================= HEADER ================= */}
      <div className="mr-pad mr-header">
        <div className="mr-brand">
          <img src="/logo.jpeg" alt="Signature" className="mr-logo" />
          <div className="mr-tagline">
            GROW TOGETHER <span>|</span> BUILD TOMORROW
          </div>
        </div>

        <div className="mr-title-wrap">
          <div className="mr-title">
            <span className="mr-title-navy">MONEY</span>{" "}
            <span className="mr-title-gold">RECEIPT</span>
          </div>
          <div className="mr-subtitle">ASSOCIATE MEMBERSHIP PROGRAM</div>
          <div className="mr-title-line"></div>
        </div>

        <div className="mr-office">
          <svg className="mr-pin" viewBox="0 0 24 32">
            <path
              d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z"
              fill="#f2a900"
            />
            <circle cx="12" cy="12" r="5" fill="#07355b" />
          </svg>
          <div className="mr-office-text">
            <div className="mr-office-title">Registered Office</div>
            <div className="mr-office-address">RDB Boulevard, 8th Floor,</div>
            <div className="mr-office-address">
              Salt Lake, Sec-V, Kolkata - 91
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECEIPT NO + DATE ================= */}
      <div className="mr-pad mr-meta">
        <div className="mr-meta-item">
          <span className="mr-meta-label">Receipt No. :</span>
          <span className="mr-meta-line mr-meta-line-left">{receiptNo}</span>
        </div>
        <div className="mr-meta-item">
          <span className="mr-meta-label">Date :</span>
          <span className="mr-meta-line mr-meta-line-right">{paymentDate}</span>
        </div>
      </div>

      {/* ================= ORANGE DIVIDER ================= */}
      <div className="mr-divider"></div>

      {/* ================= FORM ROWS ================= */}
      <div className="mr-pad mr-body">
        <div className="mr-row">
          <div className="mr-label">Received with thanks from</div>
          <div className="mr-colon">:</div>
          <div className="mr-value">{name}</div>
        </div>

        <div className="mr-row">
          <div className="mr-label">Amount</div>
          <div className="mr-colon">:</div>
          <div className="mr-value mr-value-amount">
            <span className="mr-rupee">₹</span>
            <strong className="mr-amount-strong">{amount}</strong>
          </div>
        </div>

        <div className="mr-row">
          <div className="mr-label">In words</div>
          <div className="mr-colon">:</div>
          <div className="mr-value">
            {amountWords ? `Rupees ${amountWords} only` : ""}
          </div>
        </div>

        <div className="mr-row">
          <div className="mr-label">For</div>
          <div className="mr-colon">:</div>
          <div className="mr-value">
            Associate Membership Fee for {projectName}
          </div>
        </div>

        <div className="mr-row">
          <div className="mr-label">Branch</div>
          <div className="mr-colon">:</div>
          <div className="mr-value mr-value-branch">{branch}</div>
        </div>

        <div className="mr-row">
          <div className="mr-label">Mode of Payment</div>
          <div className="mr-colon">:</div>
          <div className="mr-options">
            {MODES.map((mode) => {
              const selected = selectedMode === mode.toLowerCase();
              return (
                <div className="mr-option" key={mode}>
                  <span className="mr-checkbox">
                    {selected && (
                      <svg viewBox="0 0 10 10" width="100%" height="100%">
                        <path
                          d="M1.6 5.4l2.4 2.4 4.4-5.6"
                          stroke="#0b3155"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="mr-option-text">{mode}</span>
                </div>
              );
            })}
            <span className="mr-other-line">
              {selectedMode === "other" ? paymentMode : ""}
            </span>
          </div>
        </div>

        <div className="mr-row mr-row-txn">
          <div className="mr-label">Transaction ID / UTR No.</div>
          <div className="mr-colon">:</div>
          <div className="mr-value">{transactionId}</div>
          <div className="mr-label mr-pay-date-label">Payment Date</div>
          <div className="mr-colon">:</div>
          <div className="mr-value">{paymentDate}</div>
        </div>
      </div>

      {/* ================= AMOUNT BOX + SIGNATURES ================= */}
      <div className="mr-pad mr-bottom">
        <div className="mr-amount-box">
          <div className="mr-amount-box-rupee">₹</div>
          <div className="mr-amount-box-content">
            <div className="mr-amount-box-label">Amount :</div>
            <div className="mr-amount-box-value">{amount}</div>
          </div>
        </div>

        <div className="mr-signatures">
          <div className="mr-signature">
            <div className="mr-signature-line"></div>
            <div className="mr-signature-label">Received by</div>
          </div>
          <div className="mr-signature">
            <div className="mr-signature-line"></div>
            <div className="mr-signature-label">Authorized Signature</div>
          </div>
        </div>
      </div>

      {/* ================= LEGAL NOTE ================= */}
      <div className="mr-pad">
        <div className="mr-legal">
          The amount received is towards the Signature Associate Membership
          Program and shall not be treated as a Fixed Deposit, Investment
          Scheme, Loan Arrangement, Financial Product, Profit-Sharing
          Arrangement, or Interest-Bearing Instrument. Membership benefits and
          adjustments shall be governed by the company&apos;s prevailing
          policies and terms &amp; conditions.
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mr-footer">
        <svg
          className="mr-footer-svg"
          viewBox="0 0 277 9.5"
          preserveAspectRatio="none"
        >
          <rect x="0" y="0" width="277" height="9.5" fill="#07355b" />
          <polygon points="139,0 182.6,0 174,9.5 130,9.5" fill="#f5a000" />
        </svg>
        <div className="mr-footer-text">TOGETHER FOR A BRIGHTER TOMORROW</div>
      </div>
    </div>
  );
}