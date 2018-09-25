export default () => (
  <div className="constition">
    <p>
      <em>Decred</em>(/ˈdi:ˈkred/, /dɪˈkred/, dee-cred) is an open, progressive,
  and self-funding cryptocurrency with a system of community-based governance
  integrated into its blockchain. The project mission is to develop technology
  for the public benefit, with a primary focus on cryptocurrency technology.
      {" "}<em>Decred</em>, as a currency and as a project, is bound by the following set
  of rules, which include guiding principles, a system of governance, and a
  funding mechanism. These rules have been established in an effort to create an
  equitable and sustainable framework within which to achieve
      {" "}<em>Decred</em>&lsquo;s goals.</p>

    <hr />

    <h2>Principles</h2>
    <ul>
      <li>
        <em>Free and Open-Source Software</em> - All software developed as part of
        {" "}<em>Decred</em> shall be free and open source-software.</li>
      <li>
        <em>Free Speech and Consideration</em> - Everyone has the right to
    communicate opinions and ideas without fear of censorship. Consideration
    shall be given to all constructive speech that is based in fact and
    reason.</li>
      <li>
        <em>Multi-Stakeholder Inclusivity</em> - Inclusivity represents a
    multi-stakeholder system and an active effort shall be maintained to include
    a diverse set of views and users. While it would be ideal to include
    everyone,
        {" "}<em>Decred</em> shall comply with all relevant bodies of law in the
    jurisdictions where applicable, such as embargoes and other trade
    sanctions.</li>
      <li>
        <em>Incremental Privacy and Security</em> - Privacy and security are
    priorities and shall be balanced with the complexity of their
    implementations. Additional privacy and security technology shall be
    implemented on a continuing and incremental basis, both proactively and
    on-demand in response to attacks.</li>
      <li>
        <em>Fixed Finite Supply</em> - Issuance is finite and the total maximum
    number of coins in
        {" "}<em>Decred</em> shall not change. The total maximum supply for
        {" "}<em>Decred</em> is 20,999,999.99800912 coins, with a per-block subsidy that
    adjusts every 6,144 blocks (approximately 21.33 days) by reducing by a
    factor of 100/101. The genesis block subsidy starts at 31.19582664
    coins.</li>
      <li>
        <em>Universal Fungibility</em> - Universal fungibility is fundamental to
        {" "}<em>Decred</em> being a store of value and attacks against it shall be
    actively monitored and countermeasures pursued as necessary.</li>
    </ul>

    <hr />

    <h2>Blockchain Governance</h2>
    <ul>
      <li>Governance of the network occurs directly through the blockchain via
  hybridization of a block&rsquo;s proof-of-work (&ldquo;PoW&rdquo;) with its
  proof-of-stake (&ldquo;PoS&rdquo;). PoS contributors, known as stakeholders,
  can effectively override PoW contributors, known as miners, if 60% or more of
  the stakeholders vote against a particular block created by a miner.</li>
      <li>A lottery system is used to determine which stakeholders vote on each
  block and collect a subsidy.</li>
      <li>To be a stakeholder, one must purchase one or more tickets, which entails
  locking a specified amount of coins for approximately 1 day (256 blocks).</li>
      <li>After waiting for the ticket to mature, the ticket is entered into a
  lottery that runs once per block where the winning tickets gain the ability to
  vote on the previous block.</li>
      <li>Stakeholders must wait an average of 28 days (8,192 blocks) to vote their
  tickets, and during this time the coins used to purchase the ticket remain
  locked. The wait may be much longer or shorter than the average of 28 days
  because the ticket selection process is pseudorandom. Tickets expire after
  approximately 142 days (40,960 blocks).</li>
      <li>Stakeholder votes recorded in the blockchain are rewarded with 6% of each
  block subsidy, and each block can have up to 5 votes for a total of 30% of
  each block subsidy.</li>
      <li>PoW receives 60% of each block subsidy, subject to the constraint that
  their subsidy scales linearly with the number of PoS votes included, e.g.
  including 3 of 5 votes reduces PoW subsidy to 60% of the maximum.</li>
      <li>The votes themselves decide by majority decision whether the general
  transaction tree of the previous block, including the PoW subsidy, is valid.
  Thus, if PoS voters vote against a particular PoW block, it destroys the PoW
  subsidy (and development subsidy) and invalidates any regular transactions
  within that block.</li>
      <li>Additional vote bits may be set when stakeholders submit votes, allowing
  stakeholders to vote on matters besides the previous block.</li>
    </ul>

    <hr />

    <h2>Project Governance</h2>
    <ul>
      <li>Off-chain decision-making shall be used to resolve disputes related to
  development and voted on by the
      {" "}<em>Decred Assembly</em> as they arise, as an effective proof-of-assembly
    (&ldquo;PoA&rdquo;), until such time PoA is integrated into the
    blockchain.</li>
      <li>The
        {" "}<em>Decred Assembly</em> shall be composed of diverse Assembly members who
    are selected for membership by the
        {" "}<em>Admission Council</em> from the project ecosystem for
    representation.</li>
      <li>Councils that are composed of Assembly members shall be formed to address
  ongoing and episodic matters. The initial Councils shall serve the separate
  functions of admission (
      {" "}<em>Admission Council</em>), creation (
      {" "}<em>Creation Council</em>), and attrition (
      {" "}<em>Attrition Council</em>).</li>
      <li>The
        {" "}<em>Admission Council</em> shall vote on the inclusion of new members into
    the Assembly. All additional Councils shall be created by the
        {" "}<em>Creation Council</em>. The
        {" "}<em>Attrition Council</em> shall be responsible for deactivating both
    Councils and Assembly members as necessary.</li>
      <li>Membership of the
        {" "}<em>Decred Assembly</em> shall consist of Assembly members who have been
    confirmed by a 60% or greater affirmative vote by the
        {" "}<em>Admission Council</em>. There is no restriction on the age or
    nationality of Assembly members, the only requirement is that of merit as
    judged by the
        {" "}<em>Admission Council</em>. Merit is judged on the basis of two
    characteristics: (1) the amount of time over which one has been involved
    with the project, and (2) one&rsquo;s body of work and its impact in the
    context of the project.</li>
      <li>Attrition is embraced by temporarily deactivating or actively expelling
  Assembly members by a 60% or greater affirmative vote by the
      {" "}<em>Attrition Council</em> on the basis of: (1) substantial non-fulfillment
    of duties for one or more Councils or the Assembly, and/or (2)
    counterproductive behaviour that goes against the framework set forth in the
    Constitution without constructive action toward solutions.</li>
      <li>All matters formally presented to a Council shall be resolved by a vote in
  365 days or less.</li>
    </ul>

    <hr />

    <h2>Funding</h2>
    <ul>
      <li>Sustainability and longevity require that a subsidy of 10% of all block
  rewards be given to a development organization on an ongoing basis. The
  initial development organization shall be
      {" "}<em>Decred Holdings Group</em> LLC (&ldquo;DHG&rdquo;), a Nevis LLC that is
    responsible for funding work related to the development of the project, such
    as software development, infrastructure, and awareness.</li>
      <li>DHG shall only fund work that adheres to the guiding principles.</li>
      <li>DHG shall issue public financial statements every six months, starting
  March 8th, 2016. The frequency of financial statements may increase with
  activity, but it shall not occur more often than quarterly.</li>
      <li>DHG shall put forth a budget proposal each year on March 8th, after the
  corresponding public financial statement has been issued.</li>
      <li>The
        {" "}<em>Funding Council</em> shall review, propose changes, make changes, and
    ultimately approve the proposal by April 8th, one month from the initial
    budget proposal.</li>
      <li>Final approval of the budget via PoA vote shall occur after
        {" "}<em>Funding Council</em> approval by April 18th, two months from the initial
    proposal.</li>
      <li>DHG shall make public requests for proposals (&ldquo;RFPs&rdquo;) for
  projects that are to be completed by parties on a contractual basis. RFPs
  shall include a scope and an explanation of how the work shall benefit the
  project. Parties that submit proposals shall be required to include: (1) a
  detailed description of the work to be performed, (2) a series of milestones
  that can be verified as work is completed, and (3) a quote for the work,
  itemized by milestone, in U.S. Dollars (&ldquo;USD&rdquo;).</li>
      <li>All proposals, both submitted and accepted, shall be made public one week
  after a proposal has been selected. Once the selection occurs, the associated
  RFP shall be removed. Contracted parties shall be paid exclusively in
      {" "}<em>decred</em> (&ldquo;DCR&rdquo;) at the current effective DCR/USD rate at
    the time of payment, unless specifically noted otherwise.</li>
      <li>In the future, the development organization may need to change from DHG to
  another entity that serves an identical function. If and when this occurs, DHG
  shall transfer all assets to the new entity and the development subsidy shall
  be directed to the new entity.</li>
    </ul>

  </div>
);
