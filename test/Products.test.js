import mongoose from 'mongoose';
import ProductManager from '../src/dao/managers/ProductManager.js';
import Assert from 'assert';
import { config } from '../src/config/config.js';

const MONGO = config.mongo.url;

const assert = Assert.strict;

describe('Testing Products Manager', () => {
    
    before(async function() {
        await mongoose.connect(MONGO);
        this.productManager = new ProductManager();
    });

    beforeEach(function(){
        this.timeout(7000)
    });

    it("The DELETE method of Products must be delete a product", async function(){
        let mockProductPost = {
            title: "Delete Product Test Create",
            price: 123456,
            category: "Testing"
        }
        const productCreated = await this.productManager.post(mockProductPost);
        const productDeleted = await this.productManager.delete(productCreated._id);
        assert.ok(productCreated._id != productDeleted._id);
    });

})
