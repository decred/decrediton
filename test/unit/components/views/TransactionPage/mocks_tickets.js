export const mockTickets = {
  "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60": {
    status: "voted",
    block: {
      hash: "0000000017288e2033c8422a15ec0557bad02ee38123efb55d225d96d79c4183",
      height: 930685,
      timestamp: 1654202680
    },
    ticket: {
      timestamp: 1654202680,
      height: 930685,
      blockHash:
        "0000000017288e2033c8422a15ec0557bad02ee38123efb55d225d96d79c4183",
      hash: "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60",
      txHash:
        "65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60",
      txType: "ticket",
      debitsAmount: 6785799465,
      creditsAmount: 6785796485,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [15],
      creditAddresses: ["TsZxH8PTsbnWHg7ty2xFhUH9uzizLrNSAy7"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6785796485,
          address: "TsZxH8PTsbnWHg7ty2xFhUH9uzizLrNSAy7",
          outputScript: "unapFGH+sNJBVRkEe2EjIOCHcpFJ7baziKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 15,
          previousAmount: 6785799465
        }
      ],
      rawTx:
        "010000000154a9b3b3e7a51658a2dcadb7e6cc440acda169c47e785ba6225cab34be43dce50000000000ffffffff03850977940100000000001aba76a91461feb0d2415519047b612320e087729149edb6b388ac00000000000000000000206a1e99bf7a5e99c8c00e09ecef371eabd7865bcf5e112915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6a473044022020cfc5e2bb47ddcd39fdc1a7e82e90a8fb0c2fc01db79c683296b15afb29780c0220216ee46d39c358a18395a035b9cc0af1a0a753eed82deef8694b516b77ee0bdd0121025d5aeb18e8bb8ae1485aed5e2816990ff8b0eee40bb9ab046d738cd6e18b4edd",
      isMix: false,
      vspHost: "mockVspHost",
      txUrl:
        "https://testnet.decred.org/tx/65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60"
    },
    spender: {
      timestamp: 1654485406,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
      txHash:
        "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4",
      txType: "vote",
      debitsAmount: 6785796485,
      creditsAmount: 6790119971,
      type: 2,
      amount: 4323486,
      fee: 0,
      debitAccounts: [0],
      creditAddresses: ["Tsf35F2zDqv9EmDC1pTqixwNe5ytxyseRGr"],
      isStake: true,
      credits: [
        {
          index: 2,
          account: 15,
          internal: true,
          amount: 6790119971,
          address: "Tsf35F2zDqv9EmDC1pTqixwNe5ytxyseRGr",
          outputScript: "u3apFJm/el6ZyMAOCezvNx6r14Zbz14RiKw="
        }
      ],
      debits: [
        {
          index: 1,
          previousAccount: 0,
          previousAmount: 6785796485
        }
      ],
      rawTx:
        "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff60ed215decf9ec50b50ff4477db42b1603178dab67e35d59f22b0de16cf4c1650000000001ffffffff0300000000000000000000266a24e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e0000000000000000000000086a0601000a0000002302b9940100000000001abb76a91499bf7a5e99c8c00e09ecef371eabd7865bcf5e1188ac0000000000000000029ef841000000000000000000ffffffff02000085097794010000007d330e00060000006a473044022038c9d8cafe8d98a904c72760e29a7f1e3942c9ef398a7384ca7b946517a3f598022016768855eae1edb7297ee52717bb4c1a247e836fce316a1d681026f4bcf9e5240121027bf4538b926d5668452965c44dbf8724b571ee6b3bae2eab59fd6969e6e87f13",
      isMix: false,
      transaction:
        "137fe8e66969fd59ab2eae3b6bee71b52487bf4dc465294568566d928b53f47b02210124e5f9bcf42610681d6a31ce6f837e241a4cbb1727e57e29b7ede1ea55887616200298f5a31765947bca84738a39efc942391e7f9ae26027c704a9988dfecad8c93820024430476a00000006000e337d0000000194770985000002ffffffff00000000000000000041f89e020000000000000000ac88115ecf5b86d7ab1e37efec090ec0c8995e7abf9914a976bb1a00000000000194b902230000000a0001066a0800000000000000000000000e3b80000000009e7897b20a56241b902add7ff7db148bf679764926792b881f02d5e4246a260000000000000000000003ffffffff010000000065c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60ffffffff00ffffffff00000000000000000000000000000000000000000000000000000000000000000200000001"
    }
  },
  "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47": {
    status: "expired",
    block: {
      hash: "0000001a634aac0ddc28c3a8c68c124140671a289b6c861ecdd375c120f35517",
      height: 661573,
      timestamp: 1618322224
    },
    ticket: {
      timestamp: 1618322224,
      height: 661573,
      blockHash:
        "0000001a634aac0ddc28c3a8c68c124140671a289b6c861ecdd375c120f35517",
      hash: "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
      txHash:
        "9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
      txType: "ticket",
      debitsAmount: 6475418516,
      creditsAmount: 6475415536,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TsYUisRdHbZ7p4y2w2Hfnu9zp9bUn6BzxPu"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6475415536,
          address: "TsYUisRdHbZ7p4y2w2Hfnu9zp9bUn6BzxPu",
          outputScript: "unapFFHQaAazkipmTp6c1j/hjKpwgepmiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 6475418516
        }
      ],
      rawTx:
        "010000000120b97bf5eb8969095c3b8fa9590701f910246f464b84db62423b34c37b6747330000000000ffffffff03f0fff6810100000000001aba76a91451d06806b3922a664e9e9cd63fe18caa7081ea6688ac00000000000000000000206a1ec0e4b3a5b5a454e388c6864ae51205223a12dce4940bf781010000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001940bf7810100000044180a00020000006a47304402204be3e7097a452d99c2b56c138f8df33a923f6da1f9f465e56c75b9cdd571864902201bf7a3e9db1cfd3b7f8e55252d5f3c04311275bbc2c4ff2333472840c262b413012102936911a32e4e000e56f82207ec5d39a66b9971021869905087b23a10399cb1b0",
      isMix: false,
      txUrl:
        "https://testnet.decred.org/tx/9a1bfc118243cab22ea20499d08431c6700d2aceae6b61e2e9f6476e24bfec47",
      vspHost:
        "mock-vspHost-c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c"
    },
    spender: {
      timestamp: 1622730448,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
      txHash:
        "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c",
      txType: "revocation",
      debitsAmount: 6475415536,
      creditsAmount: 6475413336,
      type: 3,
      amount: -2200,
      fee: 2200,
      debitAccounts: [0],
      creditAddresses: ["Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6475413336,
          address: "Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU",
          outputScript: "vHapFMDks6W1pFTjiMaGSuUSBSI6EtzkiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 6475415536
        }
      ],
      rawTx:
        "010000000147ecbf246e47f6e9e2616baece2a0d70c63184d09904a22eb2ca438211fc1b9a0000000001ffffffff0158f7f6810100000000001abc76a914c0e4b3a5b5a454e388c6864ae51205223a12dce488ac000000000000000001f0fff6810100000045180a00060000006b483045022100ab8406a6b9bf915b48dd251519d64a7c8cf8019adc370bdd82b8d914e128280a02204ed8d9726d3a0b8186cba70e1dfd28be1ef3d9eb4e94dd412c85bc979b49a878012102ce47d2933e9b7a2fdd867dd95716ffa7674ea15083349c9dfc2f3a29ddb28052",
      isMix: false
    }
  },
  "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774": {
    status: "missed",
    block: {
      hash: "0000005d1fb9e2c9b514f849f20c40d51085e0176e277d5c19ba7f4fd491a825",
      height: 558424,
      timestamp: 1605621435
    },
    ticket: {
      timestamp: 1605621435,
      height: 558424,
      blockHash:
        "0000005d1fb9e2c9b514f849f20c40d51085e0176e277d5c19ba7f4fd491a825",
      hash: "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
      txHash:
        "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774",
      txType: "ticket",
      debitsAmount: 9525592746,
      creditsAmount: 9525589786,
      type: 1,
      amount: -2960,
      fee: 2960,
      debitAccounts: [6],
      creditAddresses: ["TccM3W31vkNXUCosK4Y5vYrmtiWWjuecHFs"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 2147483647,
          internal: false,
          amount: 9525589786,
          address: "TccM3W31vkNXUCosK4Y5vYrmtiWWjuecHFs",
          outputScript: "uqkUNP+z1D9bQODb6UJuU4ZfydVT0QOH"
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 6,
          previousAmount: 9525592746
        }
      ],
      rawTx:
        "0100000001781d53a4f25c754340cf9250f98039c1db2c92bcd58b1e4637c9ca534d9053c00100000000ffffffff031af7c43702000000000018baa91434ffb3d43f5b40e0dbe9426e53865fc9d553d1038700000000000000000000206a1e5c1c4094ac61fc8762be68d7b15cdb4806611cf7aa02c537020000000058000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000006085080001aa02c5370200000057850800010000006a473044022053cad54d349690d3c22b346134ff71da1b527695c6ec1252f11c1e7c5d9da9280220606a81e7d4ea63b448945cfbf1385b85642e0221cf49ca0824e5ec8ff62a61c30121032071d0e49038bcdeee3461296d2c50950b62f08e35caafbd4f2b0d025d1a47e1",
      isMix: false,
      transaction:
        "e1471a5d020d2b4fbdafca358ef0620b95502c6d296134eedebc3890e4d07120032101c3612af68fece52408ca49cf21022e64855b38f1fb5c9448b463ead4e7816a60200228a99d5d7c1e1cf15212ecc69576521bda71ff3461342bc2d39096344dd5ca5320024430476a00000001000885570000000237c502aa010008856000000000ac88000000000000000000000000000000000000000014a976bd1a0000000000000000000058000000000237c502aaf71c610648db5cb1d768be6287fc61ac94401c5c1e6a20000000000000000000008703d153d5c95f86536e42e9dbe0405b3fd4b3ff3414a9ba1800000000000237c4f71a03ffffffff0000000001c053904d53cac937461e8bd5bc922cdbc13980f95092cf4043755cf2a4531d780100000001",
      vspHost: "mockVspHost-missed",
      txUrl:
        "https://testnet.decred.org/tx/30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774"
    },
    spender: {
      timestamp: 1605714645,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "c44db16d004aa264c3cc8dcf90ecc08caa88964cb6e34477139651b56f46af79",
      txHash:
        "c44db16d004aa264c3cc8dcf90ecc08caa88964cb6e34477139651b56f46af79",
      txType: "revocation",
      debitsAmount: 9525589786,
      creditsAmount: 9525587586,
      type: 3,
      amount: -2200,
      fee: 2200,
      debitAccounts: [2147483647],
      creditAddresses: ["TsZRAVD9t8shxck66daNEhaWrWCsYV9e2Qp"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 6,
          internal: true,
          amount: 9525587586,
          address: "TsZRAVD9t8shxck66daNEhaWrWCsYV9e2Qp",
          outputScript: "vHapFFwcQJSsYfyHYr5o17Fc20gGYRz3iKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 2147483647,
          previousAmount: 9525589786
        }
      ],
      rawTx:
        "01000000017457e53cda6f04dc671bf2bde52568add0bbe4fb9fc3db74b43a769d0406dd300000000001ffffffff0182eec4370200000000001abc76a9145c1c4094ac61fc8762be68d7b15cdb4806611cf788ac0000000000000000011af7c437020000005885080005000000904730440220163ae79bc0713243f5e627aeafb680fbc2126b153188b4921d954056efc3fa61022040c5ecfdaa83175cef7faf99460b765779c4bcf09cc6e72782d491664bb66dbb01475121038add32307530f18099a9208f32fc04502b40073ea6a6cfebbbd79988270a612e2103f2a96dbe354081542af9571c43662b883d9ae02416cd5080137c0556c7a0976d52ae",
      isMix: false
    }
  },
  b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99: {
    status: "revoked",
    block: {
      hash: "000000080433728b66a9dcd5471205adde4df9619af27f45613f60c4d3dc8a02",
      height: 815405,
      timestamp: 1637487987
    },
    ticket: {
      timestamp: 1637487987,
      height: 815405,
      blockHash:
        "000000080433728b66a9dcd5471205adde4df9619af27f45613f60c4d3dc8a02",
      hash: "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
      txHash:
        "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99",
      txType: "ticket",
      debitsAmount: 8600221089,
      creditsAmount: 8600218109,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TsnHm1YjaLMmnFsyGwt54D4P53aFaNqeESJ"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 8600218109,
          address: "TsnHm1YjaLMmnFsyGwt54D4P53aFaNqeESJ",
          outputScript: "unapFOlPYM9gpJSRDMD+KPZi22h5RnROiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 8600221089
        }
      ],
      rawTx:
        "010000000145dff3de5ec042630f66a9ba4ea2ed6d70f3fa306af01858a83efa676d3779000000000000ffffffff03fde99c000200000000001aba76a914e94f60cf60a494910cc0fe28f662db687946744e88ac00000000000000000000206a1e8ef37a84dc2bc7c924877e1ab3026b3b5a102e5fa1f59c0002000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001a1f59c00020000002c710c00030000006a47304402206888557060684807b6e78f47ea8c186debe45f2316a584abe60c5495f36f77f80220249421832ab9ea9e6bbb70d50376e7f48258b3108a345dc299d1de8186e046060121036343175c705537c636732c42fa699ba96f6296bc66b915216cbc833d00e18e10",
      isMix: false,
      transaction:
        "108ee1003d83bc6c2115b966bc96626fa99b69fa422c7336c63755705c1743630321010646e08681ded199c25d348a10b35882f4e77603d570bb6b9eeab92a832194242002f8776ff395540ce6ab84a516235fe4eb6d188cea478fe7b6074868607055886820024430476a00000003000c712c00000002009cf5a1010000000000000000ac88000000000000000000000000000000000000000014a976bd1a000000000000000000004e0000000002009cf5a15f2e105a3b6b02b31a7e8724c9c72bdc847af38e1e6a2000000000000000000000ac884e74467968db62f628fec00c9194a460cf604fe914a976ba1a000000000002009ce9fd03ffffffff00000000000079376d67fa3ea85818f06a30faf3706deda24ebaa9660f6342c05edef3df450100000001",
      vspHost: "",
      txUrl:
        "https://testnet.decred.org/tx/b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99"
    },
    spender: {
      timestamp: 1643948925,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "c63ff33bf5955e8636d57be2762d60e1fedaf65c92548e08784db9a4e433de1d",
      txHash:
        "c63ff33bf5955e8636d57be2762d60e1fedaf65c92548e08784db9a4e433de1d",
      txType: "revocation",
      debitsAmount: 8600218109,
      creditsAmount: 8600218109,
      type: 3,
      amount: 0,
      fee: 0,
      debitAccounts: [0],
      creditAddresses: ["Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 8600218109,
          address: "Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy",
          outputScript: "vHapFI7zeoTcK8fJJId+GrMCaztaEC5fiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 8600218109
        }
      ],
      rawTx:
        "0200000001997fa9df69903ad5d40fce86f0da366f3d9c13b842e947d1d0859a30e3e24eb00000000001ffffffff01fde99c000200000000001abc76a9148ef37a84dc2bc7c924877e1ab3026b3b5a102e5f88ac000000000000000001fde99c00020000002d710c000800000000",
      isMix: false,
      transaction:
        "0000000008000c712d00000002009ce9fd010000000000000000ac885f2e105a3b6b02b31a7e8724c9c72bdc847af38e14a976bc1a000000000002009ce9fd01ffffffff0100000000b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f990100000002"
    }
  },
  d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f: {
    status: "unmined",
    block: null,
    ticket: {
      timestamp: 1658937788,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
      txHash:
        "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f",
      txType: "ticket",
      debitsAmount: 20002980,
      creditsAmount: 20000000,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TsRWjysgoNXTS7JAQXfsaAzts8UM3Dq3WUg"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 20000000,
          address: "TsRWjysgoNXTS7JAQXfsaAzts8UM3Dq3WUg",
          outputScript: "unapFAVpSQ3nfoA2C1xW+RhdcLMvdGCoiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 20002980
        }
      ],
      rawTx:
        "01000000011babed986d25d5c3c27a1626e6caa344899949974a83bf63a49c2b1fa5f0514a0000000000ffffffff03002d31010000000000001aba76a9140569490de77e80360b5c56f9185d70b32f7460a888ac00000000000000000000206a1e9154057f4df98e818b05779aea2a20f6b624012ea438310100000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001a43831010000000000000000ffffffff6a4730440220290c05e17b48e8c6ed6ee42326565a91416835b75c5f481b10a16e5b0dfa9f67022001d99b93ae971419db6e411dab042828e34ed2b0c7fcd30bd50ccae3d333a393012102af8273525052a10d5c8906ea288968d6f8c7e68caeaab58554b429e8f535e269",
      isMix: false,
      transaction:
        "69e235f5e829b45485b5aaae8ce6c7f8d6688928ea06895c0da15250527382af02210193a333d3e3ca0cd50bd3fcc7b0d24ee3282804ab1d416edb191497ae939bd9012002679ffa0d5b6ea1101b485f5cb7356841915a562623e46eedc6e8487be1050c2920024430476affffffff0000000000000000013138a4010000000000000000ac88000000000000000000000000000000000000000014a976bd1a000000000000000000004e0000000000013138a42e0124b6f6202aea9a77058b818ef94d7f0554911e6a2000000000000000000000ac88a860742fb3705d18f9565c0b36807ee70d49690514a976ba1a00000000000001312d0003ffffffff00000000004a51f0a51f2b9ca463bf834a9749998944a3cae626167ac2c3d5256d98edab1b0100000001",
      vspHost: "mockVspHost-unmined"
    },
    spender: {
      timestamp: 0,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "",
      txHash: null,
      txType: "regular",
      debitsAmount: 0,
      creditsAmount: 0,
      type: 0,
      amount: 0,
      fee: 0,
      debitAccounts: [],
      creditAddresses: [],
      isStake: false,
      credits: [],
      debits: [],
      rawTx: null,
      direction: "sent",
      isMix: false
    }
  },
  f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530: {
    status: "immature",
    block: {
      hash: "00000000c6bc60d4227652382007799a066f94f3086f6ff56d6c0e726908c4c9",
      height: 930690,
      timestamp: 1654203366
    },
    ticket: {
      timestamp: 1654203366,
      height: 930690,
      blockHash:
        "00000000c6bc60d4227652382007799a066f94f3086f6ff56d6c0e726908c4c9",
      hash: "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
      txHash:
        "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530",
      txType: "ticket",
      debitsAmount: 6785799465,
      creditsAmount: 6785796485,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TsSSWJRNEor8X6R33GSoo68p3yq3zFuGoVK"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6785796485,
          address: "TsSSWJRNEor8X6R33GSoo68p3yq3zFuGoVK",
          outputScript: "unapFA+UU96/HfOSYqbq+B/LmP95fIlciKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 6785799465
        }
      ],
      rawTx:
        "01000000011a1b3fc2661245ba6b8cab9e315cf76b16c565f1c1277512608d51906f1636c10000000000ffffffff03850977940100000000001aba76a9140f9453debf1df39262a6eaf81fcb98ff797c895c88ac00000000000000000000206a1e19e5ba2f1f3b99efe1090707638af39998a1b7582915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6b483045022100a510695025634a249cda2c85fe63a43312cb0ee5c02db2f1256fe4f835702f8002202b0f4c7e093500b75626a4829c9705a370cb2f2f834702abe8b9ac268d5ac57b012102dfa5deeeee8b65f2738483d412f2bb5627fa7f761b132f3b4eef2e154151902c",
      isMix: false,
      transaction:
        "2c905141152eef4e3b2f131b767ffa2756bbf212d4838473f2658beeeedea5df0221017bc55a8d26acb9e8ab0247832f2fcb70a305979c82a42656b70035097e4c0f2b2002802f7035f8e46f25f1b22dc0e50ecb1233a463fe852cda9c244a6325506910a50021024530486bffffffff000000000000000194771529010000000000000000ac88000000000000000000000000000000000000000014a976bd1a000000000000000000004e00000000019477152958b7a19899f38a63070709e1ef993b1f2fbae5191e6a2000000000000000000000ac885c897c79ff98cb1ff8eaa66292f31dbfde53940f14a976ba1a0000000000019477098503ffffffff0000000000c136166f90518d60127527c1f165c5166bf75c319eab8c6bba451266c23f1b1a0100000001",
      vspHost: "mockVspHost-immature",
      txUrl:
        "https://testnet.decred.org/tx/f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530"
    },
    spender: {
      timestamp: 0,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "",
      txHash: null,
      txType: "regular",
      debitsAmount: 0,
      creditsAmount: 0,
      type: 0,
      amount: 0,
      fee: 0,
      debitAccounts: [],
      creditAddresses: [],
      isStake: false,
      credits: [],
      debits: [],
      rawTx: null,
      direction: "sent",
      isMix: false
    }
  },
  "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07": {
    status: "live",
    block: {
      hash: "00000000d0ac2c2cf4065c823f3a71033edc0afe2b9be90482e0c10ff57c80f6",
      height: 930696,
      timestamp: 1654204193
    },
    ticket: {
      timestamp: 1654204193,
      height: 930696,
      blockHash:
        "00000000d0ac2c2cf4065c823f3a71033edc0afe2b9be90482e0c10ff57c80f6",
      hash: "05fba7101e0d038bad81777f221189eebce9461d1181djjhj284f32ed3664e07",
      txHash:
        "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07",
      txType: "ticket",
      debitsAmount: 6785799465,
      creditsAmount: 6785796485,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [0],
      creditAddresses: ["TscyVUMxevtGhTuTvM6LkLnvQGU97kEyUg4"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 6785796485,
          address: "TscyVUMxevtGhTuTvM6LkLnvQGU97kEyUg4",
          outputScript: "unapFIMhyeEfBENiiiK/SodiN02IfAYyiKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 0,
          previousAmount: 6785799465
        }
      ],
      rawTx:
        "010000000164f0acf752429210f469c6536c857d092aac8bc84fa661f013b535aa6394c4710000000000ffffffff03850977940100000000001aba76a9148321c9e11f0443628a22bf4a8762374d887c063288ac00000000000000000000206a1e01ca6bb0120ca64e750a9cbaa66597f010c1c03d2915779401000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac000000000000000001291577940100000000000000ffffffff6b483045022100a58c8e7b6f33b3c3fdc43dfa7472d19e39cc8c22c5990f94ca45a9458c860bfe02202227864c234f9a2c328418cabf6a5934e99d16806a8492805ad4243155d77e63012102029965f740c2b87c21dca96fb4195f71dae34b779ef4daed5902f98a0c09a437",
      isMix: false,
      transaction:
        "37a4090c8af90259eddaf49e774be3da715f19b46fa9dc217cb8c240f7659902022101637ed7553124d45a8092846a80169de934596abfca1884322c9a4f234c8627222002fe0b868c45a945ca940f99c5228ccc399ed17274fa3dc4fdc3b3336f7b8e8ca50021024530486bffffffff000000000000000194771529010000000000000000ac88000000000000000000000000000000000000000014a976bd1a000000000000000000004e0000000001947715293dc0c110f09765a6ba9c0a754ea60c12b06bca011e6a2000000000000000000000ac8832067c884d3762874abf228a6243041fe1c9218314a976ba1a0000000000019477098503ffffffff000000000071c49463aa35b513f061a64fc88bac2a097d856c53c669f410924252f7acf0640100000001",
      vspHost: "mockVspHost-live",
      txUrl:
        "https://testnet.decred.org/tx/05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07"
    },
    spender: {
      timestamp: 0,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "",
      txHash: null,
      txType: "regular",
      debitsAmount: 0,
      creditsAmount: 0,
      type: 0,
      amount: 0,
      fee: 0,
      debitAccounts: [],
      creditAddresses: [],
      isStake: false,
      credits: [],
      debits: [],
      rawTx: null,
      direction: "sent",
      isMix: false
    }
  },
  "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57": {
    status: "voted",
    block: {
      hash: "00000000bbf1f33870cec5e4da9a7eb7a80c17b07cd3ba4865f4086fa6f8cd3e",
      height: 919842,
      timestamp: 1652858637
    },
    ticket: {
      timestamp: 1652858637,
      height: 919842,
      blockHash:
        "00000000bbf1f33870cec5e4da9a7eb7a80c17b07cd3ba4865f4086fa6f8cd3e",
      hash: "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
      txHash:
        "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57",
      txType: "ticket",
      debitsAmount: 12271681343,
      creditsAmount: 12271678363,
      type: 1,
      amount: -2980,
      fee: 2980,
      debitAccounts: [15],
      creditAddresses: ["TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU"],
      isStake: true,
      credits: [
        {
          index: 0,
          account: 0,
          internal: true,
          amount: 12271678363,
          address: "TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU",
          outputScript: "unapFFyo29n4+AuvdgX88JdEQQCZoS+biKw="
        }
      ],
      debits: [
        {
          index: 0,
          previousAccount: 15,
          previousAmount: 12271681343
        }
      ],
      rawTx:
        "0100000001b50f2e03314661b566e3f0f246623c4419d8ec605da401f407a5f67cf148ce920000000000ffffffff039bf372db0200000000001aba76a9145ca8dbd9f8f80baf7605fcf09744410099a12f9b88ac00000000000000000000206a1e53b208495f9fabdfa80b4be10c4d0e488b33f2993fff72db02000000004e000000000000000000001abd76a914000000000000000000000000000000000000000088ac0000000000000000013fff72db0200000000000000ffffffff6b483045022100d8f4e49c56f3249947a759d7ba766b671579399e758feaa12bc525c822c020f602200266d21d887165183479cf3d06a01470ceadc53b73527f6863ae76bf22a11ea001210355d8fdf5cdec7a8848e6d653d6c379908c256d4b54b7be637ab5018d56d19149",
      isMix: false,
      transaction:
        "4991d1568d01b57a63beb7544b6d258c9079c3d653d6e648887aeccdf5fdd855032101a01ea122bf76ae63687f52733bc5adce7014a0063dcf7934186571881dd266022002f620c022c825c52ba1ea8f759e397915676b76bad759a7479924f3569ce4f4d80021024530486bffffffff0000000000000002db72ff3f010000000000000000ac88000000000000000000000000000000000000000014a976bd1a000000000000000000004e0000000002db72ff3f99f2338b480e4d0ce14b0ba8dfab9f5f4908b2531e6a2000000000000000000000ac889b2fa19900414497f0fc0576af0bf8f8d9dba85c14a976ba1a000000000002db72f39b03ffffffff000000000092ce48f17cf6a507f401a45d60ecd819443c6246f2f0e366b5614631032e0fb50100000001",
      vspHost: "mockVspHost-votedticket",
      txUrl:
        "https://testnet.decred.org/tx/6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57"
    },
    spender: {
      timestamp: 1652874655,
      height: -1,
      blockHash: null,
      index: 0,
      hash: "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
      txHash:
        "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da",
      txType: "vote",
      debitsAmount: 12271678363,
      creditsAmount: 12276267831,
      type: 2,
      amount: 4589468,
      fee: 0,
      debitAccounts: [0],
      creditAddresses: ["TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n"],
      isStake: true,
      credits: [
        {
          index: 2,
          account: 15,
          internal: true,
          amount: 12276267831,
          address: "TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n",
          outputScript: "u3apFFOyCElfn6vfqAtL4QxNDkiLM/KZiKw="
        }
      ],
      debits: [
        {
          index: 1,
          previousAccount: 0,
          previousAmount: 12271678363
        }
      ],
      rawTx:
        "01000000020000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff574f7189057261e0e816b09306c3dd4ae55146be8d1ce52a4d5c2475fdcf85600000000001ffffffff0300000000000000000000266a2432c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e0000000000000000000000086a0601000a00000037fbb8db0200000000001abb76a91453b208495f9fabdfa80b4be10c4d0e488b33f29988ac0000000000000000029c0746000000000000000000ffffffff0200009bf372db0200000022090e00110000006a4730440220481a66bdf843d6fe2f41b0b5ba129cfec694f82bac72602d08998a2a8b792fb2022003b0a2c8ddfcc317fdb5fac33cc0fbff280ce4bc250caef3e94840c79ef60ee301210355174775888e14ed49e50dd0b904e6dca3f6b4595afd9248a020a4aa87ae469e",
      isMix: false,
      transaction:
        "9e46ae87aaa420a04892fd5a59b4f6a3dce604b9d00de549ed148e8875471755032101e30ef69ec74048e9f3ae0c25bce40c28fffbc03cc3fab5fd17c3fcddc8a2b0032002b22f798b2a8a99082d6072ac2bf894c6fe9c12bab5b0412ffed643f8bd661a4820024430476a00000011000e092200000002db72f39b000002ffffffff00000000000000000046079c020000000000000000ac8899f2338b480e4d0ce14b0ba8dfab9f5f4908b25314a976bb1a000000000002dbb8fb370000000a0001066a0800000000000000000000000e09a8000000008b1c4f860ead93c8ba72242eb9a324ca13b68dff624da24511b0c832246a260000000000000000000003ffffffff01000000006085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57ffffffff00ffffffff00000000000000000000000000000000000000000000000000000000000000000200000001"
    }
  }
};
