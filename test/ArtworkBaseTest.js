const ArtworkBase = artifacts.require('ArtworkBase')
const faker = require('faker')

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

contract('ArtworkBase', accounts => {
  
  describe('ArtworkBase unit test', () => {
    const [owner, gallery1, gallery2, buyer1] = accounts
    let artworkBase

    beforeEach(async () => {
      artworkBase = await ArtworkBase.new()
    })

    it('allows owner to add a gallerist', async () => {
      try {
        await artworkBase.addGallery(gallery1, galleryName1, address1, { from: owner })
        const [name, completeAddress, artworkCount] = await artworkBase.getGalleryByAddress(gallery1)
        assert.equal(name, galleryName1)
        assert.equal(completeAddress, address1)
        assert.equal(artworkCount, 0)
      } catch (error) {
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
  })
})