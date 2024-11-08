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
							<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
								<FaInstagram className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							</a>
							<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
								<FaTwitter className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							</a>
							<a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
								<FaLinkedin className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							</a>
							<a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
								<FaYoutube className="text-2xl cursor-pointer hover:text-[#5ef6ff]" />
							</a>
						</div>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-[#f75049] font-rajdhaniSemiBold text-2xl pb-4">Company</p>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							About Us
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Careers
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Press
						</li>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-[#f75049] font-rajdhaniSemiBold text-2xl pb-4">Resources</p>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Blog
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Help Center
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Privacy Policy
						</li>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-[#f75049] font-rajdhaniSemiBold text-2xl pb-4">Contact</p>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Contact Us
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							Support
						</li>
						<li className="text-[#e2e2ef] text-md pb-2 font-rajdhaniMedium hover:text-[#5ef6ff] cursor-pointer">
							FAQ
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
