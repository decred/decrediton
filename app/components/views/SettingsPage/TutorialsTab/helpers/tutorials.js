import { FormattedMessage as T } from "react-intl";

const tutorials = {};

tutorials.decredIntro = {
  title: "Decred Intro",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "decredIntroThumb",
  slides: [
    {
      label: (
        <T id="tutorials.decredIntro.label1" m="Why was Decred created?" />
      ), // TODO
      doc: "DecredIntoPage01",
      title: (
        <T id="tutorials.decredIntro.title1" m="Why was Decred created?" />
      ),
      images: ["decredIntroSlideImage1"]
    },
    {
      label: <T id="tutorials.decredIntro.label2" m="Governance systems" />, // TODO
      doc: "DecredIntoPage02",
      title: (
        <T
          id="tutorials.decredIntro.title2"
          m="Governance systems empower its community"
        />
      ),
      images: ["decredIntroSlideImage2-1", "decredIntroSlideImage2-2"]
    }
  ]
};

tutorials.ln = {
  title: "What is Lightning Network?",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "lnThumb",
  slides: [
    {
      label: <T id="tutorials.ln.label1" m="Backup" />,
      doc: "LNWalletCreationWarningPage01",
      title: (
        <T
          id="tutorials.ln.title1"
          m="Backup data is needed in addition to wallet seed."
        />
      ),
      images: ["LNSlideImage1"]
    },
    {
      label: <T id="tutorials.ln.label6" m="Lightning is a Layer 2 Network" />,
      doc: "LNWalletCreationWarningPage06",
      title: (
        <T
          id="tutorials.ln.title6"
          m="Lightning Network is a layer 2 network on top of the Decred blockchain, designed to facilitate micropayments more efficiently."
        />
      ),
      images: ["LNSlideImage2"]
    },
    {
      label: <T id="tutorials.ln.label2" m="Staying Online" />,
      doc: "LNWalletCreationWarningPage02",
      title: (
        <T
          id="tutorials.ln.title2"
          m="It's preferred to keep your wallet online most of the time."
        />
      ),
      images: ["LNSlideImage3"]
    },
    {
      label: <T id="tutorials.ln.label3" m="Watchtower Service" />,
      doc: "LNWalletCreationWarningPage03",
      title: (
        <T
          id="tutorials.ln.title3"
          m="Episodic wallets should use a watchtower service for safety."
        />
      ),
      images: ["LNSlideImage4"]
    },
    {
      label: <T id="tutorials.ln.label4" m="Channels and Confirmations" />,
      doc: "LNWalletCreationWarningPage04",
      title: (
        <T
          id="tutorials.ln.title4"
          m="Sending and receiving amounts are limited to what is available in your published channels."
        />
      ),
      images: ["LNSlideImage5"]
    },
    {
      label: <T id="tutorials.ln.label5" m="Unlocked During Operations" />,
      doc: "LNWalletCreationWarningPage05",
      title: (
        <T
          id="tutorials.ln.title5"
          m="Minimize risk by using a separate wallet for Lightning."
        />
      ),
      images: ["LNSlideImage6"]
    }
  ]
};

tutorials.consensusCode = {
  title: "Consensus Code",
  desc:
    "Small description of decredIntroThumbthe tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "consensusCodeThumb",
  slides: [
    {
      label: <T id="tutorials.consensusCode.label1" m="Consensus Code" />, // TODO
      doc: "ConsensusCodePage01",
      title: (
        <T id="tutorials.consensusCode.title1" m="Focus on Consensus Code" />
      ),
      images: ["consensusCodeSlideImage1-1", "consensusCodeSlideImage1-2"]
    }
  ]
};

tutorials.powPos = {
  title: "Hybrid PoW/PoS",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "powPosThumb",
  slides: [
    {
      label: <T id="tutorials.powPos.label1" m="POW" />, // TODO
      doc: "PowPosPage01",
      title: (
        <T id="tutorials.powPos.title1" m="1 CPU, 1 Vote – Proof-of-Work" />
      ),
      images: ["powPosSlideImage1"]
    },
    {
      label: <T id="tutorials.powPos.label2" m="POS" />, // TODO
      doc: "PowPosPage02",
      title: (
        <T id="tutorials.powPos.title2" m="1 Coin, 1 Vote – Proof-Of Stake" />
      ),
      images: ["powPosSlideImage2"]
    },
    {
      label: <T id="tutorials.powPos.label3" m="Hybrid PoW/PoS" />, // TODO
      doc: "PowPosPage03",
      title: (
        <T
          id="tutorials.powPos.title3"
          m="Hybrid PoW/PoS - best of both worlds"
        />
      ),
      images: ["powPosSlideImage3"]
    }
  ]
};

tutorials.tickets = {
  title: "Staking and Tickets",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "ticketsThumb",
  slides: [
    {
      label: <T id="tutorials.tickets.label1" m="Time-locking coins" />, // TODO
      doc: "TicketsPage01",
      title: (
        <T
          id="tutorials.tickets.title1"
          m="Tickets are created by time-locking coins"
        />
      ),
      images: ["ticketsSlideImage1"]
    },
    {
      label: (
        <T id="tutorials.tickets.label2" m="Tickets have multiple functions" />
      ), // TODO
      doc: "TicketsPage02",
      title: (
        <T id="tutorials.tickets.title2" m="Tickets have multiple functions" />
      ),
      images: ["ticketsSlideImage2-1", "ticketsSlideImage2-2"]
    },
    {
      label: <T id="tutorials.tickets.label3" m="Rewards" />, // TODO
      doc: "TicketsPage03",
      title: <T id="tutorials.tickets.title3" m="Rewards" />,
      images: ["ticketsSlideImage3-1", "ticketsSlideImage3-2"]
    }
  ]
};

tutorials.staking = {
  title: "Core Functions of Staking",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "stakingThumb",
  slides: [
    {
      label: <T id="tutorials.staking.label1" m="New block creation" />, // TODO
      doc: "StakingPage01",
      title: <T id="tutorials.staking.title1" m="New block creation" />,
      images: ["stakingSlideImage1"]
    },
    {
      label: <T id="tutorials.staking.label2" m="Consensus Changes" />, // TODO
      doc: "StakingPage02",
      title: <T id="tutorials.staking.title2" m="Consensus Changes" />,
      images: ["stakingSlideImage2"]
    },
    {
      label: (
        <T id="tutorials.staking.label3" m="Treasury and Project Management" />
      ), // TODO
      doc: "StakingPage03",
      title: (
        <T id="tutorials.staking.title3" m="Treasury and Project Management" />
      ),
      images: [
        "stakingSlideImage3-1",
        "stakingSlideImage3-2",
        "stakingSlideImage4-1",
        "stakingSlideImage4-2"
      ]
    }
  ]
};

tutorials.lifecycle = {
  title: "Ticket Lifecycle",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "lifecycleThumb",
  slides: [
    {
      label: (
        <T id="tutorials.lifecycle.label1" m="Proof-of-Stake, Block Rewards" />
      ), // TODO
      doc: "LifecyclePage01",
      title: (
        <T id="tutorials.lifecycle.title1" m="Proof-of-Stake, Block Rewards" />
      ),
      images: ["lifecycleSlideImage1-1", "lifecycleSlideImage1-2"]
    },
    {
      label: (
        <T id="tutorials.lifecycle.label2" m="Ticket's different states" />
      ), // TODO
      doc: "LifecyclePage02",
      title: (
        <T
          id="tutorials.lifecycle.title2"
          m="Ticket goes through different states in their lifecycle"
        />
      ),
      images: ["lifecycleSlideImage2"]
    },
    {
      label: <T id="tutorials.lifecycle.label3" m="Immature tickets" />, // TODO
      doc: "LifecyclePage03",
      title: <T id="tutorials.lifecycle.title3" m="Immature tickets" />,
      images: ["lifecycleSlideImage3-1", "lifecycleSlideImage3-2"]
    },
    {
      label: <T id="tutorials.lifecycle.label4" m="Live Tickets" />, // TODO
      doc: "LifecyclePage04",
      title: <T id="tutorials.lifecycle.title4" m="Live Tickets" />,
      images: ["lifecycleSlideImage4-1", "lifecycleSlideImage4-2"]
    },
    {
      label: <T id="tutorials.lifecycle.label5" m="Voted Tickets" />, // TODO
      doc: "LifecyclePage05",
      title: <T id="tutorials.lifecycle.title5" m="Voted Tickets" />,
      images: [
        "lifecycleSlideImage5-1",
        "lifecycleSlideImage5-2",
        "lifecycleSlideImage5-3",
        "lifecycleSlideImage5-4"
      ]
    },
    {
      label: (
        <T id="tutorials.lifecycle.label6" m="“When Something Went Wrong”" />
      ), // TODO
      doc: "LifecyclePage06",
      title: (
        <T id="tutorials.lifecycle.title6" m="“When Something Went Wrong”" />
      ),
      images: [
        "lifecycleSlideImage6-1",
        "lifecycleSlideImage6-2",
        "lifecycleSlideImage6-3"
      ]
    }
  ]
};

tutorials.consensusVoting = {
  title: "Consensus Voting",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "consensusVotingThumb",
  slides: [
    {
      label: <T id="tutorials.consensusVoting.label1" m="Overview" />, // TODO
      doc: "ConsensusVotingPage01",
      title: <T id="tutorials.consensusVoting.title1" m="Overview" />,
      images: ["consensusVotingSlideImage1"]
    },
    {
      label: <T id="tutorials.consensusVoting.label2" m="Rules" />, // TODO
      doc: "ConsensusVotingPage02",
      title: <T id="tutorials.consensusVoting.title2" m="Rules" />,
      images: ["consensusVotingSlideImage2"]
    },
    {
      label: <T id="tutorials.consensusVoting.label3" m="Infrastructure" />, // TODO
      doc: "ConsensusVotingPage03",
      title: <T id="tutorials.consensusVoting.title3" m="Infrastructure" />,
      images: ["consensusVotingSlideImage3"]
    },
    {
      label: <T id="tutorials.consensusVoting.label4" m="Upgrade" />, // TODO
      doc: "ConsensusVotingPage04",
      title: <T id="tutorials.consensusVoting.title4" m="Upgrade" />,
      images: ["consensusVotingSlideImage4"]
    },
    {
      label: <T id="tutorials.consensusVoting.label5" m="Timeframe" />, // TODO
      doc: "ConsensusVotingPage05",
      title: <T id="tutorials.consensusVoting.title5" m="Timeframe" />,
      images: ["consensusVotingSlideImage5"]
    },
    {
      label: <T id="tutorials.consensusVoting.label6" m="Ticket Lifecycle" />, // TODO
      doc: "ConsensusVotingPage06",
      title: <T id="tutorials.consensusVoting.title6" m="Ticket Lifecycle" />,
      images: ["consensusVotingSlideImage6"]
    },
    {
      label: <T id="tutorials.consensusVoting.label7" m="Approval" />, // TODO
      doc: "ConsensusVotingPage07",
      title: <T id="tutorials.consensusVoting.title7" m="Approval" />,
      images: ["consensusVotingSlideImage7"]
    }
  ]
};

tutorials.blocks = {
  title: "Block Creation",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  thumbnailImage: "blocksThumb",
  slides: [
    {
      label: (
        <T id="tutorials.blocks.label1" m="Introduction to Block Voting" />
      ), // TODO
      doc: "BlocksPage01",
      title: (
        <T id="tutorials.blocks.title1" m="Introduction to Block Voting" />
      ),
      images: ["blocksSlideImage1"]
    },
    {
      label: <T id="tutorials.blocks.label2" m="Votes" />, // TODO
      doc: "BlocksPage02",
      title: <T id="tutorials.blocks.title2" m="Votes" />,
      images: ["blocksSlideImage2"]
    },
    {
      label: <T id="tutorials.blocks.label3" m="Rejection" />, // TODO
      doc: "BlocksPage03",
      title: <T id="tutorials.blocks.title3" m="Rejection" />,
      images: ["blocksSlideImage3"]
    },
    {
      label: <T id="tutorials.blocks.label4" m="Incentives" />, // TODO
      doc: "BlocksPage04",
      title: <T id="tutorials.blocks.title4" m="Incentives" />,
      images: ["blocksSlideImage4"]
    },
    {
      label: <T id="tutorials.blocks.label5" m="Hard forks" />, // TODO
      doc: "BlocksPage05",
      title: <T id="tutorials.blocks.title5" m="Hard forks" />,
      images: ["blocksSlideImage5"]
    }
  ]
};

tutorials.identity = {
  title: "Identity (Pi/CMS)",
  desc:
    "Small description of the tutorial in 1-2 sentences. Small description of the tutorial in 1-2 sentences. ", // TODO
  slides: [
    {
      label: <T id="tutorials.identity.label1" m="Back-up your ID" />, // TODO
      doc: "IdentityPage01",
      title: <T id="tutorials.identity.title1" m="Back-up your ID" />,
      images: ["identitySlideImage1"]
    },
    {
      label: <T id="tutorials.identity.label2" m="Identity and Proposals" />, // TODO
      doc: "IdentityPage02",
      title: <T id="tutorials.identity.title2" m="Identity and Proposals" />,
      images: ["identitySlideImage2"]
    },
    {
      label: <T id="tutorials.identity.label3" m="Identity and CMS" />, // TODO
      doc: "IdentityPage03",
      title: <T id="tutorials.identity.title3" m="Identity and CMS" />,
      images: ["identitySlideImage3"]
    },
    {
      label: <T id="tutorials.identity.label4" m="Submit invoices in time" />, // TODO
      doc: "IdentityPage04",
      title: <T id="tutorials.identity.title4" m="Submit invoices in time" />,
      images: ["identitySlideImage4"]
    }
  ]
};
export default tutorials;
