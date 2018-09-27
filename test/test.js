const faker = require('faker')

const Auction = artifacts.require('Auction')
const ArtworkOwnership = artifacts.require('ArtworkOwnership')
const { increaseTime } = require('./utils')

const ETHER = 10**18

const category1 = 'Painting'
const category2 = 'Sculture'
const artist1 = faker.name.findName()
const artist2 = faker.name.findName()
const image1 = faker.image.imageUrl()
const image2 = faker.image.imageUrl()
const address1 = `${faker.address.city()}, ${faker.address.country()}`
const address2 = `${faker.address.city()}, ${faker.address.country()}`
const randomWord1 = faker.random.word()
const randomWord2 = faker.random.word()
const galleryName1 = faker.company.companyName()
const galleryName2 = faker.company.companyName()
const description1 = faker.random.words(8)
const description2 = faker.random.words(7)
const year1 = faker.random.number({ min: 1900, max: 2018 })
const year2 = faker.random.number({ min: 1900, max: 2018 })

function awaitEvent (event, handler) {
  return new Promise((resolve, reject) => {
    function wrappedHandler (...args) {
      Promise.resolve(handler(...args)).then(resolve).catch(reject);
    }

    event.watch(wrappedHandler);
  });
}

contract('ArtworkBase, Auction', accounts => {

  const [owner, gallery1, gallery2, buyer1, bidder1, bidder2, bidder3] = accounts
  let artworkBase
  let auction

  beforeEach(async () => {
    artworkBase = await ArtworkOwnership.deployed()
    // auction = await Auction.deployed()
  })

  describe('ArtworkBase unit test', () => {

    it('allows owner to add a gallerist', async () => {
      try {
        await artworkBase.addGallery(gallery1, galleryName1, address1, { from: owner })
        const [name, completeAddress, artworkCount] = await artworkBase.getGalleryByAddress(gallery1)
        assert.equal(name, galleryName1)
        assert.equal(completeAddress, address1)
        assert.equal(artworkCount, 0)
      } catch (error) {
        console.log(error)
        assert.fail()  
      }
    })

    it('does not allow non-owner to add a gallerist', async () => {
      try {
        await artworkBase.addGallery(gallery2, galleryName2, address2, { from: gallery1 })
        assert.fail()
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('allows a gallerist to add an artwork', async () => {
      try {
        await artworkBase.addGallery(gallery1, galleryName1, address1, { from: owner })
        await artworkBase.addArtwork(randomWord1, category1, artist1, image1, description1, year1, { from: gallery1 })
        const [title, category, artist, photoIpfsHash, description, year] = await artworkBase.getArtwork(0)
        const count = await artworkBase.getArtworkCount()
        assert.equal(count, 1)
        assert.equal(title, randomWord1)
        assert.equal(category, category1)
        assert.equal(artist, artist1)
        assert.equal(photoIpfsHash, image1)
        assert.equal(description, description1)
        assert.equal(year, year1)
      } catch (error) {
        assert.fail()        
      }
    })

    it('does not allow non-gallerist to add an artwork', async () => {
      try {
        await artworkBase.addArtwork(randomWord2, category2, artist2, image2, description2, year2, { from: buyer1 })
        assert.fail()
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('allows gallerist to create an auction', async () => {
      await artworkBase.createAuction(0, 3600, 5 * ETHER, 10 * ETHER, 0.5 * ETHER, { from: gallery1 })
      const event = artworkBase.CreateContract({})
      const watcher = async function (err, result) {
        event.stopWatching()
        if (err) throw err
        const auctionAddress = result.args._auctionAddress
        assert.equal(await artworkBase.getArtworkOwner(0), auctionAddress)
        auction = await Auction.at(auctionAddress)
      }
      await awaitEvent(event, watcher)
    })
  })
  describe('Auction unit test', () => {

    it('deployed contract should have the expected details', async () => {
      const actualOwner = await auction.owner()
      const startDate = await auction.startDate()
      const endDate = await auction.endDate()
      const startingBid = await auction.startingBid()
      const bidIncrement = await auction.bidIncrement()
      const tokenId = await auction.tokenId()
      const highestAllowedBidAmount = await auction.highestAllowedBidAmount()
      const hasOwnerWithdrawn = await auction.hasOwnerWithdrawn()
      const highestBidder = await auction.highestBidder()
      assert.equal(actualOwner, gallery1)
      // assert.equal(new Date(startDate * 1000).toGMTString(), new Date(deployedDate).toGMTString())
      // assert.equal(new Date(endDate * 1000).toGMTString(), new Date(deployedDate + 3600).toGMTString())
      assert.equal(startingBid, 5 * ETHER)
      assert.equal(bidIncrement, 0.5 * ETHER)
      assert.equal(tokenId, 0)
      assert.equal(highestAllowedBidAmount, 10 * ETHER)
      assert.equal(hasOwnerWithdrawn, false)
      assert.equal(highestBidder, '0x0000000000000000000000000000000000000000')
    })

    it('expects the highest bid to be zero if there is no bid yet', async () => {
      const highestBid = await auction.getHighestBid({ from: bidder1 })
      assert.equal(highestBid, 0)
    })
  
    it('does not allow to get the winner if the auction is not yet ended', async () => {
      try {
        await auction.getWinner({ from: bidder1 })
        assert.fail()
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('does not allow contract owner to place bid', async () => {
      try {
        await auction.placeBid({ from: owner, value: 300 })
        assert.fail()
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('does not allow to bid an amount less than the starting price', async () => {
      try {
        await auction.placeBid({ from: bidder1, value: 2 * ETHER})
        assert.fail()
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('allows bidder to bid a valid bid', async () => {
      try {
        await auction.placeBid({ from: bidder1, value: 5 * ETHER})
        let highestBidder = await auction.highestBidder()
        assert.equal(highestBidder, bidder1)
        let bidder1TotalBid = await auction.getTotalBidByAddress(bidder1)
        assert.equal(bidder1TotalBid, 5 * ETHER)
        await auction.placeBid({ from: bidder2, value: 5.5 * ETHER})
        highestBidder = await auction.highestBidder()
        assert.equal(highestBidder, bidder2)
        await auction.placeBid({ from: bidder1, value: 1 * ETHER})
        highestBidder = await auction.highestBidder()
        assert.equal(highestBidder, bidder1)
        bidder1TotalBid = await auction.getTotalBidByAddress(bidder1)
        assert.equal(bidder1TotalBid, 6 * ETHER)
      } catch (error) {
        assert.fail()
      }
    })

    it('does not allow to bid amount less than the current highest bid', async () => {
      try {
        await auction.placeBid({ from: bidder3, value: 5.5 * ETHER})
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('allows user to get the current highest bid', async () => {
      try {
        let highestBid = await auction.getHighestBid()
        assert.equal(highestBid, 6 * ETHER)
        await auction.placeBid({ from: bidder1, value: 2 * ETHER})
        highestBid = await auction.getHighestBid()
        assert.equal(highestBid, 8 * ETHER)
      } catch (error) {
        assert.fail()
      }
    })

    it('does not allow owner to withdraw their money when the auction is not yet ended', async () => {
      try {
        await auction.withdraw({ from: bidder1 })
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    it('does not allow a bidder to withdraw their money when the auction is not yet ended', async () => {
      try {
        await auction.withdraw({ from: bidder1 })
      } catch (error) {
        assert.ok(/revert/.test(error.message))
      }
    })

    describe('when auction has ended', async () => {
      beforeEach(() => {
        increaseTime(4000)
      })

      it('time remaining should be zero', async () => {
        const timeRemaining = await auction.getTimeRemaining()
        assert.equal(timeRemaining, 0)
      })

      it('does not allow to place bid', async () => {
        try {
          await auction.placeBid({ from: bidder3, value: 9 * ETHER})
        } catch (error) {
          assert.ok(/revert/.test(error.message))
        }
      })

      it('allows to get the winning bidder', async () => {
        try {
          const [highestBidder, bidAmount] = await auction.getWinner()
          assert.equal(highestBidder, bidder1)
          assert.equal(bidAmount, 8 * ETHER)
        } catch (error) {
          assert.fail()
        }
      })

      it('does not allow the winning bidder to withdraw his/her money', async () => {
        try {
          await auction.withdraw({ from: bidder1 })
          assert.fail()
        } catch (error) {
          assert.ok(/revert/.test(error.message))
        }
      })

      it('allows the losing bidder to withdraw his/her money', async () => {
        try {
          const currentBidder2Bal = await web3.eth.getBalance(bidder2) / ETHER
          await auction.withdraw({ from: bidder2 })
          assert.equal((await web3.eth.getBalance(bidder2) / ETHER).toFixed(2), (currentBidder2Bal + 5.5).toFixed(2))
        } catch (error) {
          assert.fail()
        }
      })

      it('allows the owner to withdraw the amount of the winning bidder', async () => {
        try {
          const currentOwnerBal = await web3.eth.getBalance(gallery1) / ETHER
          await auction.withdraw({ from: gallery1 })
          assert.equal((await web3.eth.getBalance(gallery1) / ETHER).toFixed(0), (currentOwnerBal + 8).toFixed(0))
        } catch (error) {
          console.log(error)
          assert.fail()
        }
      })

      it('does not allow the owner to withdraw the winning bid after he/she already withdraw it', async () => {
        try {
          await auction.withdraw({ from: owner })
        } catch (error) {
          assert.ok(/revert/.test(error.message))
        }
      })

      it('allows the auction owner to transfer the token to the highest bidder', async () => {
        try {
          await auction.transferToken({ from: gallery1 })
          assert.equal(await artworkBase.getArtworkOwner(0), bidder1)
        } catch (error) {
          console.log(error)
          assert.fail()
        }
      })
    })
  })
})