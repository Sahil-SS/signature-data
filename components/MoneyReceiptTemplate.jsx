import "./receipt.css";

export default function MoneyReceiptTemplate({ data }) {
  return (
    <div id="receipt" className="receipt-page">
      {/* HEADER */}
      <div className="receipt-header">
        <div className="receipt-logo">
          <img src="/logo.jpeg" alt="Company Logo" />
        </div>
        <div className="receipt-company">
          <p>
            101, 1st Floor, Anantham Building, Surendra Singh Compound, Kokar
            Chowk, Kokar, Ranchi - 834001
          </p>
          <p>Dooravani Nagar, Bengaluru, Karnataka 560016</p>
          {/* <p>Website: www.reodevelop.com | Email: admin@reodevelop.com</p> */}
        </div>
      </div>

      <div className="receipt-title-box">
        <h1>PAYMENT RECEIPT</h1>
      </div>

      {/* META */}
      <div className="receipt-meta">
        <span>
          <b>Date:</b> {data.date}
        </span>
        <span>
          <b>Receipt No:</b> {data.receiptNo}
        </span>
      </div>

      {/* BODY */}
      <p className="receipt-text">
        Received with thanks from <b>{data.name}</b>
      </p>

      <p className="receipt-text">
        a sum of <b>₹ {data.amount}</b> (Rupees {data.amountWords} only) towards
        Association Membership Fee for the property details mentioned below:
      </p>

      {/* DETAILS */}
      <div className="receipt-details-box">
        {/* <div><span>Project Name</span><span>{data.projectName}</span></div> */}
        {/* <div><span>Property Type</span><span>{data.propertyType}</span></div> */}
        {/* <div><span>Location</span><span>{data.location}</span></div> */}
        {/* <div>
          <span>Area</span>
          <span>{data.area}</span>
        </div> */}
        <div>
          <span>Transaction No</span>
          <span>{data.transactionId}</span>
        </div>
        <div>
          <span>Payment Mode</span>
          <span>{data.paymentMode}</span>
        </div>
        <div>
          <span>Payment Date</span>
          <span>{data.paymentDate}</span>
        </div>
      </div>

      {/* NOTE */}
      <div className="receipt-note-box">
        <p>
          The amount received is towards the Signature Associate Membership
          Program and shall not be treated as a Fixed Deposit, Investment
          Scheme, Loan Arrangement, Financial Product, Profit-Sharing
          Arrangement, or Interest-Bearing Instrument. Membership benefits and
          adjustments shall be governed by the company&apos;s prevailing
          policies and terms & conditions.
        </p>
      </div>

      {/* FOOTER */}
      <div className="receipt-footer">
        <p className="receipt-disclaimer">
          This is a computer-generated receipt; hence, no signature is required.
        </p>
      </div>
    </div>
  );
}
