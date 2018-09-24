const Auction = artifacts.require('Auction')

const ETHER = 10**18

contract('Auction', accounts => {

  describe('Auction unit test', () => {
    const [owner, bidder1, bidder2] = accounts
    let auction
    let deployedDate

    beforeEach(async () => {
      auction = await Auction.new(3600, 0, 5 * ETHER, 20 * ETHER, 0.5 * ETHER)
      deployedDate = new Date().getTime()
    })

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
      // assert.equal(actualOwner, owner)
      // assert.equal(new Date(startDate * 1000).toGMTString(), new Date(deployedDate).toGMTString())
      // assert.equal(new Date(endDate * 1000).toGMTString(), new Date(deployedDate + 3600).toGMTString())
      assert.equal(startingBid, 5 * ETHER)
      assert.equal(bidIncrement, 0.5 * ETHER)
      assert.equal(artworkIndex, 0)
      assert.equal(highestAllowedBidAmount, 20 * ETHER)
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
        console.log(error.message)
        assert.fail()
      }
    })
  })
})