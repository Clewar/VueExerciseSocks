Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template:`
    <div class="product">

    <div class="product-image">
      <img v-bind:src="image">
    </div>
    
    <div class="product-info">
      <h1>{{ title }}</h1>
      <!--
        <p> <a v-bind:href="link">{{ description }} </a> </p>
      -->
      <p v-if="inStock">In Stock</p>
      <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
      <!--
        <p v-if="onSale">ON SALE! </p>
      -->
      <p>Shipping: {{ shipping }}</p>

      <ul>
        <li v-for="detail in details"> {{detail}} </li>
      </ul>

      <!-- 
      <ul>
        <li v-for="size in sizes"> {{size}} </li>
      </ul>
      -->

      <div v-for="(variant, index) in variants"
           :key="variant.variantId"
           class="color-box"
           :style="{ backgroundColor: variant.variantColor }"
           @mouseover="updateProduct(index)">
      </div>

      <div class="button-container">

        <button @click="addToCart"
        :disabled ="!inStock"
        :class="{ disabledButton: !inStock }">Add to Cart</button>

        <button @click="removeFromCart">Remove</button>
        
        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>
    
      </div>

     </div>

    </div>
    `,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue',
            selectedVariant: 0,
            description: 'Comfy red socks',
            link: 'https://www.youtube.com/',
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "greensocks.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "bluesocks.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ["small","medium","large"],
            reviews: []
        }
    } ,
    methods: {
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index){
            this.selectedVariant = index
            //console.log(index)
        },
        addReview(productReview){
            this.reviews.push(productReview)
        }
    },
    computed: {
        title(){
            return this.brand + ' ' +this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity 
        },
        shipping(){
            if(this.premium){
                return "Free"
            }
            return 2.99
        }
    }
})

Vue.component('product-review',{
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    `,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            this.errors = []
            if(this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null

            }
            else{
                if(!this.name) this.errors.push("Name requiered")
                if(!this.review) this.errors.push("Review requiered")
                if(!this.rating) this.errors.push("Rating requiered")
            }
        }
    }
})

var app = new Vue({
    el:'#app',
    data:{
        premium: true,
        cart: []
    },
    methods:{
        addToCart(id){
            this.cart.push(id)
        },
        removeFromCart(id){
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                   this.cart.splice(i, 1);
                }
              }
        },
    }
    
})