/*
const _processSolidityEncodePackedArgs = (type, value) => {
  // see @truffle\contract\dist\truffle-contract.js -> _processSolidityEncodePackedArgs
  //let type = funABI.outputs[0].type
  //let value = output.decoded[0]
  if ((type.startsWith('int') || type.startsWith('uint')) && typeof value === 'string' && !/^(-)?0x/i.test(value)) {
    value = new window.web3.utils.BN(value)
  }
  if (Array.isArray(value)) {
    if (type.startsWith('int') || type.startsWith('uint')) {
      value = value.map(val => {
        return new window.web3.utils.BN(val)
      })
    }
  }
}*/

const defineConstant = (funABI, contract_address) => {
  return (...args) => new Promise((Resolve, Reject) => {
    window.connex.thor.account(contract_address).method(funABI).call(...args).then(output => {
      // console.log('method-----', funABI)
      // console.log('output2-----:'+funABI.name, output.decoded)
      // if (funABI.name === 'auctionsByIndex') console.log('output2-----:'+funABI.name, output.decoded)
      // let result = _processSolidityEncodePackedArgs(funABI.outputs[0].type, output.decoded[0])
      const a1 = ['offersOf']
      if (a1.indexOf(funABI.name) !== -1) {
        for (let i = 0; i < funABI.outputs.length; i++) {
          const type = funABI.outputs[i].type
          if (type.indexOf('uint') === -1) continue
          if (type.indexOf('[]') > -1) { // number array
            const value = output.decoded[i]
            output.decoded[i] = []
            for (let j = 0; j < value.length; j++) output.decoded[i][j] = new window.web3.utils.BN(value[j])
          } else { // number
            output.decoded[i] = new window.web3.utils.BN(output.decoded[i])
          }
        }
        return Resolve(output.decoded)
      }
      const aa = ['bidOfTokenIdByIndex', 'bidOfBidderByIndex', 'stakingPools', 'stakingPoolDeeps', 'totalStakingOf', 'stakingsByIndexOf',
        'tokenOfOwnerByIndexs'
      ]
      if (aa.indexOf(funABI.name) !== -1) {
        return Resolve(output.decoded) // tạm
      }
      if (funABI.name === 'stakeByTokenId' || funABI.name === 'stakeInPoolByStakeId') {
        const auc = [output.decoded[0], output.decoded[1], output.decoded[2], output.decoded[3], output.decoded[4], output.decoded[5], output.decoded[6], output.decoded[7]]
        Resolve(auc)
      } else if (typeof output.decoded[6] === 'boolean') { // auctionByIndex, auctionByTokenId, auctionOfOwnerByIndex
        const auc = {
          seller: output.decoded[0],
          tokenId: output.decoded[1],
          startedAt: output.decoded[2],
          startingPrice: output.decoded[3],
          endingPrice: output.decoded[4],
          duration: output.decoded[5],
          closeWhenTimeout: output.decoded[6]
        }
        Resolve([auc])
      } else if (funABI.name === 'stakeInfoByTokenId') {
        Resolve([output.decoded[0], output.decoded[1]])
      }
      let result = output.decoded[0]
      if (funABI.outputs[0].type === 'uint256') {
        result = new window.web3.utils.BN(result)
      } else if (funABI.outputs[0].type.indexOf('uint256[') !== -1) {
        for (let i = 0; i < result.length; i++) result[i] = new window.web3.utils.BN(result[i])
      }
      if (funABI.outputs[1] && funABI.outputs[1].type === 'uint256') {
        const result1 = new window.web3.utils.BN(output.decoded[1])
        Resolve([result, result1])
        return
      }
      Resolve(result)
    }).catch(err => {
      Reject(err)
    })
  })
  // return (...args) => window.connex.thor.account(address).method(method).call(...args)
}

const defineSignedRequest = (funABI, contract_address) => {
  return async(...args) => {
    // console.log('args 1-----', args)
    let caller = {}
    let clauses = []
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'object' && (args[i].from || args[i].value || args[i].gas || args[i].getClause)) {
        caller = args[i]
        args.splice(i, 1)
      }
    }
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'object' && args[i].clauses) {
        clauses = args[i].clauses
        args.splice(i, 1)
      }
    }
    // console.log('args 2-----', args)
    // console.log('caller-----', caller)
    // console.log('clauses-----', clauses)
    // console.log('method-----', funABI)

    /*
    args = [[{
      tokenId:'1000',
      startingPrice:'1000000000000000000',
      endingPrice:'1000000000000000000',
      duration:'3600',
      closeWhenTimeout:false
    }]]
    // args = [['tuple([1000, 1000000000000000000, 1000000000000000000, 3600, false])']]
    console.log('args 3-----', args)*/
    // args = [['1000','1000000000000000000','1000000000000000000','3600',false]]

    /*
    const txClause = {
      purpose: 'identification',
      payload: {
        type: 'text',
        content: 'Please select a wallet to grant access to DApp.'
      }
    }
    let signArgs = ['tx']
    let requestArgs = []
    if (window.connex.version) requestArgs.push(txClause)
    else signArgs.push(txClause)
    const signingService = window.connex.vendor.sign(...signArgs)
    const cert = await signingService.request(...requestArgs)*/

    if (window.connex.version) {
      const signingService = window.connex.vendor.sign('tx')
      const txMethod = window.connex.thor.account(contract_address).method(funABI)
      const txClause = []
      if (clauses.length) {
        for (let i = 0; i < clauses.length; i++) {
          txClause.push(txMethod.asClause(...clauses[i]))
        }
      } else {
        const clause = txMethod.asClause(...args)
        if (typeof caller.value === 'string') clause.value = caller.value
        else if (typeof caller.value === 'object') clause.value = caller.value.toString()
        txClause.push(clause)
      }
      if (caller.getClause) return txClause

      if (caller.gas) signingService.gas(caller.gas) // Set maximum gas
      if (typeof caller.from === 'string') signingService.signer(caller.from) // Enforce signer
      const transactionInfo = await signingService.request(txClause)
      return transactionInfo
    } else {
      const txMethod = window.connex.thor.account(contract_address).method(funABI)
      if (typeof caller.value === 'string') txMethod.value(caller.value)
      else if (typeof caller.value === 'object') txMethod.value(caller.value.toString())
      /*
      args = [[{
        tokenId:'8000',
        startingPrice:'2000000000000000000',
        endingPrice:'1000000000000000000',
        duration:'3600',
        closeWhenTimeout:false
      }]]*/
      const txClause = []
      if (clauses.length) {
        for (let i = 0; i < clauses.length; i++) {
          txClause.push(txMethod.asClause(...clauses[i]))
        }
      } else {
        txClause.push(txMethod.asClause(...args))
      }
      if (caller.getClause) return txClause
      const signingService = window.connex.vendor.sign('tx', txClause)
        .comment(`Contract call [${funABI.name}]`)
      if (caller.gas) signingService.gas(caller.gas) // Set maximum gas
      if (typeof caller.from === 'string') signingService.signer(caller.from) // Enforce signer
      const transactionInfo = await signingService.request()
      return transactionInfo
    }
  }
}

const defineEvent = (funABI, contract_address) => {
  return window.connex.thor.account(contract_address).event(funABI)
}

export function contract(json = {}, networkId) {
  const instance = {}
  instance.address = json.networks[networkId].address
  //
  json.abi.forEach(method => {
    if (!method.name) return
    if (method.type === 'function') {
      if (method.constant) {
        if (!instance[method.name]) instance[method.name] = defineConstant(method, instance.address)
      } else {
        if (!instance[method.name]) instance[method.name] = defineSignedRequest(method, instance.address)
      }
    } else if (method.type === 'event') {
      instance[method.name] = defineEvent(method, instance.address)
    }
  })
  //
  return instance
}

const waitForNextBlock = () => window.connex.thor.ticker().next()
const getTransactionReceipt = (id) => window.connex.thor.transaction(id).getReceipt()
export async function waitTxReceipt(id) {
  let done = false
  do {
    await waitForNextBlock()
    const transaction = await getTransactionReceipt(id)
    if (transaction) {
      done = true
      return transaction
    }
  } while (done === false)
}

export async function callWithClauses(txClause, from) {
  if (window.connex.version) {
    const signingService = window.connex.vendor.sign('tx')
    if (from) signingService.signer(from) // Enforce signer
    return await signingService.request(txClause)
  } else {
    const signingService = window.connex.vendor.sign('tx', txClause)
    if (from) signingService.signer(from) // Enforce signer
    return await signingService.request()
  }
}
