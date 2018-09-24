const Auction = artifacts.require('Auction')
const { increaseTime } = require('./utils')

const ETHER = 10**18

contract('Auction', accounts => {
  const [owner, bidder1, bidder2, bidder3] = accounts
    let auction
    let deployedDate

    beforeEach(async () => {
      auction = await Auction.deployed()
      deployedDate = new Date().getTime()
    })

  describe('Auction unit test', () => {

    it('deployed contract should have the expected details', async () => {
      const actualOwner = await auction.owner()
      const startDate = await auction.startDate()
      const endDate = await auction.endDate()
      const startingBid = await auction.startingBid()
      const bidIncrement = await auction.bidIncrement()
      const artworkIndex = await auction.artworkIndex()
      const highestAllowedBidAmount = await auction.highestAllowedBidAmount()
      const hasOwnerWithdrawn = await auction.hasOwnerWithdrawn()
      const highestBidder = await auction.highestBidder()
      // console.log(new Date(deployedDate))
      // console.log(startDate.c * 1000)
      // console.log(endDate * 1000)
      assert.equal(actualOwner, owner)
      // assert.equal(new Date(startDate * 1000).toGMTString(), new Date(deployedDate).toGMTString())
      // assert.equal(new Date(endDate * 1000).toGMTString(), new Date(deployedDate + 3600).toGMTString())
      assert.equal(startingBid, 5 * ETHER)
      assert.equal(bidIncrement, 0.5 * ETHER)
      assert.equal(artworkIndex, 0)
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
        increaseTime(3600)
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
          const currentOwnerBal = await web3.eth.getBalance(owner) / ETHER
          await auction.withdraw({ from: owner })
          assert.equal((await web3.eth.getBalance(owner) / ETHER).toFixed(0), (currentOwnerBal + 8).toFixed(0))
        } catch (error) {
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
    })
  })
})