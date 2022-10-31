const hre = require('hardhat');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe("Spacebear", () => {
    async function deploySpacebearAndMintTokenFixture() {
        const Spacebear = await hre.ethers.getContractFactory("Spacebear");
        const spacebearInstance = await Spacebear.deploy();

        const [owner, other] = await ethers.getSigners();

        await spacebearInstance.safeMint(other.address);
        return { spacebearInstance };
    }

    it('mints a token', async () => {
        const { spacebearInstance } = await loadFixture(
            deploySpacebearAndMintTokenFixture
        );

        const [owner, other] = await ethers.getSigners();

        expect(await spacebearInstance.ownerOf(0)).to.equal(other.address);
    });

    it('fails to transfer tokens from the wrong address', async () => {
        const { spacebearInstance } = await loadFixture(
            deploySpacebearAndMintTokenFixture
        );

        const [owner, nftOwner, notNftOwner] = await ethers.getSigners();

        expect(await spacebearInstance.ownerOf(0)).to.equal(nftOwner.address);

        await expect(
            spacebearInstance
                .connect(notNftOwner)
                .transferFrom(nftOwner.address, notNftOwner.address, 0)
        ).to.be.revertedWith("ERC721: caller is not token owner nor approved");

    })
})