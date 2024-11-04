
import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

function Footer() {
	return (
		<>
			<div className="bg-[#0e0e17] h-1/2 w-full flex md:flex-row flex-col justify-around items-start p-20">
				<div className="p-5 ">
					<ul>
						<p className="text-[#e2e2ef] font-rajdhaniBold text-3xl pb-6">
							TECH<span className="text-[#f75049]">Quest</span>
						</p>
						<div className="flex gap-6 pb-5">
							<FaInstagram className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							<FaTwitter className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							<FaLinkedin className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							<FaYoutube className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
						</div>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-[#f75049] font-rajdhaniSemiBold text-2xl pb-4">Directories</p>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Placeholder
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Placeholder
						</li>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-[#f75049] font-rajdhaniSemiBold text-2xl pb-4">Directories</p>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Placeholder
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Placeholder
						</li>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-[#f75049] font-rajdhaniSemiBold text-2xl pb-4">Directories</p>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Placeholder
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Placeholder
						</li>
					</ul>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center text-center  p-5 bg-[#0e0e17]">
				<h1 className=" text-[#f75049] font-rajdhaniSemiBold">
					Copyright © 2024 TechQuest Ltd All Rights Reserved
				</h1>
			</div>
		</>
	);
}

export default Footer;
