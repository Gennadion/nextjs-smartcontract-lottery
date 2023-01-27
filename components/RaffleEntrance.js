import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import { Bell } from "@web3uikit/icons";

export default function RaffleEntrance() {
	const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
	const [entranceFee, setEntranceFee] = useState("0");
	const [numberOfPlayers, setNumberOfPlayers] = useState("0");
	const [recentWinner, setRecentWinner] = useState("N/A");

	const dispatch = useNotification();

	const {
		runContractFunction: enterRaffle,
		isLoading,
		isFetching,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	});

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getRecentWinner",
		params: {},
	});

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString();
		const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString();
		const recentWinnerFromCall = await getRecentWinner();
		setEntranceFee(entranceFeeFromCall);
		setNumberOfPlayers(numberOfPlayersFromCall);
		setRecentWinner(recentWinnerFromCall);
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async function (tx) {
		await tx.wait(1);
		handleNewNotification(tx);
		updateUI();
	};

	const handleNewNotification = () => {
		dispatch({
			type: "info",
			message: "Transaction Complete!",
			title: "tx Notification",
			position: "topR",
			icon: <Bell fontSize="50px" />,
		});
	};

	return (
		<div className="p-5">
			{raffleAddress ? (
				<div>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto delay-100 "
						onClick={async function () {
							await enterRaffle({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							});
						}}
						disabled={isLoading || isFetching}
					>
						{isLoading || isFetching ? (
							<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
						) : (
							<div>Enter Raffle</div>
						)}
					</button>
					<div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
					
					<div>Players: {numberOfPlayers}</div>
					<div>Recent Winner: {recentWinner}</div>
				</div>
			) : (
				<div>No Raffle Address Detected!</div>
			)}
		</div>
	);
}
