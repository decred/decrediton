import { shell } from "electron";

export default () => (
  <div className="constition">
    <p>
      Decred (/ˈdi:ˈkred/, /dɪˈkred/, dee-cred) is a secure, adaptable and self-funding cryptocurrency with a system of community-based governance integrated into its blockchain. The project mission is to develop technology for the public benefit, with a primary focus on cryptocurrency technology. This constitution defines a set of principles which guide the decision-making of the project’s stakeholders, and describes the processes through which the blockchain and Treasury are governed. This document is meant to manage the expectations of prospective and actual Decred users, so that they more clearly understand the social contract between themselves and the project. This document is not intended to take precedence over the Decred network’s consensus rules, should any conflict arise.
    </p>

    <hr />

    <h2>Principles</h2>
    <ul>
      <li>
        <em>Free and Open-Source Software</em> - All software developed as part of Decred shall be free and open source-software.
      </li>
      <li>
        <em>Free Speech and Consideration</em> - Everyone has the right to communicate opinions and ideas without fear of censorship. Consideration shall be given to all constructive speech that is based in fact and reason.
      </li>
      <li>
        <em>Multi-Stakeholder Inclusivity</em> - Inclusivity represents a multi-stakeholder system and an active effort shall be maintained to include a diverse set of views and users.
      </li>
      <li>
        <em>Incremental Privacy and Security</em> - Privacy and security are priorities and shall be balanced with the complexity of their implementations. Additional privacy and security technology shall be implemented on a continuing and incremental basis, both proactively and on-demand in response to attacks.
      </li>
      <li>
        <em>Fixed Finite Supply</em> - Issuance is finite and the total issuance shall not exceed 20,999,999.99800912 DCR, with a per-block subsidy that adjusts every 6,144 blocks (approximately 21.33 days) by reducing by a factor of 100/101. The genesis block subsidy starts at 31.19582664 DCR.
      </li>
      <li>
        <em>Universal Fungibility</em> - Universal fungibility is fundamental to Decred being a store of value and attacks against it shall be actively monitored and countermeasures pursued as necessary.
      </li>
    </ul>

    <hr />

    <h2>Blockchain Governance</h2>
    <ul>
      <li>
        <a onClick={() => shell.openExternal("https://docs.decred.org/governance/overview/")}>Governance</a> of the network occurs directly through the blockchain via hybridization of a block’s proof-of-work (&ldquo;PoW&rdquo;) with its proof-of-stake (&ldquo;PoS&rdquo;). PoS voters, also known as stakeholders, can effectively override PoW contributors, known as miners, if 50% or more of the stakeholders vote against a particular block created by a miner.
      </li>
      <li>
        Stakeholders are people who purchase one or more tickets, which entails locking a specific amount of DCR. The amount of DCR that must be locked, also known as the ticket price, fluctuates as the system targets 40,960 tickets in the live pool.
      </li>
      <li>
        In each block, 5 tickets are called to vote, determined by a lottery <a onClick={() => shell.openExternal("https://docs.decred.org/proof-of-stake/overview/")}>system</a>. When a ticket is called, a nominated wallet must actively respond with a vote. For a block to be accepted by the network, it must include votes from at least 3 of the 5 tickets called. The blockchain cannot be extended without the active participation of stakeholders.
      </li>
      <li>
        Stakeholders must wait an average of 28 days (8,192 blocks) to vote their tickets, and during this time the DCR used to purchase the ticket remain locked. The wait may be much longer or shorter than the average of 28 days because the ticket selection process is pseudorandom. Tickets expire after 40,960 blocks (~142 days) if they have not been called to vote.
      </li>
      <li>
        Stakeholder votes recorded in the blockchain are rewarded with 6% of each block subsidy, and each block can have up to 5 votes for a total of 30% of each block subsidy.
      </li>
      <li>
        PoW receives 60% of each block subsidy, subject to the constraint that their subsidy scales linearly with the number of PoS votes included, e.g. including 3 of 5 votes reduces PoW subsidy to 60% of the maximum.
      </li>
      <li>
        The votes themselves decide by majority decision whether the regular transaction tree of the previous block, including the PoW subsidy, is valid. Thus, if PoS voters vote against a particular PoW block, it invalidates the PoW reward (and Treasury reward) and invalidates any regular transactions within that block.
      </li>
      <li>
        Decred’s process for <a onClick={() => shell.openExternal("https://docs.decred.org/governance/consensus-rule-voting/overview/")}>amending the consensus rules</a> is also driven by stakeholder voting. The process begins when at least 95% of PoW miners and 75% of PoS voters have upgraded their software to a new version with latent changes to the rules. Once these conditions are met, a voting period of 8,064 blocks (~4 weeks) begins, to decide whether the latent rule changes should be activated.
      </li>
      <li>
        For a rule change proposal to be approved, at least 75% of the tickets not set to Abstain must vote Yes. If this requirement is met, and a quorum of 10% tickets voting Yes or No is achieved, then the rule change will be activated 8,064 blocks (~4 weeks) later.
      </li>
    </ul>

    <hr />

    <h2>Project Governance and Funding</h2>
    <ul>
      <li>
        Sustainability and longevity require that 10% of all block rewards be given to a project Treasury fund, administered by a development organization.
      </li>
      <li>
        The initial development organization is <em>Decred Holdings Group</em> LLC (&ldquo;DHG&rdquo;), a Nevis LLC that is responsible for funding work related to the development of the project, such as software development, infrastructure, and awareness. DHG shall comply with all relevant bodies of law in the jurisdictions where applicable, such as embargoes and other trade sanctions.
      </li>
      <li>
        The project aims to transition to a Decentralized Autonomous Organization (DAO) which controls the disbursement of Treasury funds.
      </li>
      <li>
        For as long as DHG has responsibility for managing the Treasury (i.e. until control is fully decentralized), it holds a veto that can be exercised if it is felt that following through with a decision would put the project, the DHG corporate entity or DHG’s managers in jeopardy.
      </li>
      <li>
        <a onClick={() => shell.openExternal("https://docs.decred.org/governance/politeia/overview/")}>Politeia</a> proposals are the mechanism through which stakeholders make policy decisions and approve programs of work. Politeia proposals must be approved by at least 60% of the tickets that vote, and at least 20% of the eligible tickets must participate in the vote. The default voting period is 2,016 blocks (~1 week).
      </li>
      <li>
        Decred <a onClick={() => shell.openExternal("https://docs.decred.org/contributing/overview/")}>contractors</a> are individuals and corporations who work on the project, under an agreement that they are compensated for their work. Decred contractors are autonomous, they cannot be managed directly by stakeholders. Through Politeia, stakeholders can approve or reject programs of work as performed by specific contractors, but they cannot mandate that workers take certain actions.
      </li>
      <li>
        The Decred contractor collective is a self-regulating entity, wherein cells working on specific aspects resolve disputes and add new members independently. As described in the approved <a onClick={() => shell.openExternal("https://proposals.decred.org/proposals/fa38a3593d9a3f6cb2478a24c25114f5097c572f6dadf24c78bb521ed10992a4")}>Decred Contractor Clearance proposal</a>, disputes that cannot be satisfactorily resolved within a team can be escalated to an all contractor vote - once the contractor management system which will facilitate this is operational. If necessary, unresolved matters could be further escalated to a stakeholder vote as the ultimate decision-making authority.
      </li>
      <li>
        The will of the stakeholders, as expressed through their on-chain and Politeia ticket voting, is the ultimate decision-making force for the project.
      </li>
      <li>
        This constitution will be ratified by a Politeia vote before it takes effect, and can be further amended by approval of subsequent Politeia proposals.
      </li>
    </ul>

  </div>
);
