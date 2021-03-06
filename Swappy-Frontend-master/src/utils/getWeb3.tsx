import Web3 from 'web3';
import { ethers } from 'ethers';
import { Contract } from 'ethers';

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    console.log(window);
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
		console.log(window);
  } else {
    throw new Error("Metamask Not Installed")
  }
}

const getAccountInformation = async () : Promise<string | undefined> => {
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts();
	const account = accounts[0]

  if(!account) {
    throw new Error("No Accounts Present")
  }
  return account;
}

const getNetworkId = async () => {
	let networkId = await window.web3.eth.net.getId()
	if(!networkId) {
		throw new Error("Invalid Network Id")
	}
	return networkId
}

const loadContractInstance = async (abi: string, address?: string) : Promise<Contract | undefined> => {
	try {
		const web3 = window.web3
		let provider = new ethers.providers.Web3Provider(web3.currentProvider);
		if(address === undefined) {
			throw new Error("Address Not defined")
		}
		let contract = new ethers.Contract(address, abi, provider.getSigner(0));
		await contract.deployed()
		return contract;
	} catch(error) {
		throw new Error("Contract not found at given address")
	}
}

export { loadWeb3, getAccountInformation, loadContractInstance, getNetworkId }
