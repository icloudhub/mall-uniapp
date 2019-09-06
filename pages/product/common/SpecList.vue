<template>
	<!-- 规格-模态层弹窗 -->
	<view class="speclist"
	>
		<!-- 遮罩层 -->
		<view class="mask"></view>
		<view class="layer attr-content" @click.stop="stopPrevent">
			<view class="a-t">
				<image :src="selectsku.pic"></image>
				<view class="right">
					<text class="price">¥{{selectsku.price}}</text>
					<text class="stock">库存：{{selectsku.stock}}件</text>
					<view class="selected">
						已选：
						<text class="selected-text">
							{{ selectsku.sp1 }}
						</text>
						<text class="selected-text">
							{{ selectsku.sp2 }}
						</text>
					</view>
				</view>
			</view>
			<view class="item-right">
				<uni-number-box 
					class="step"
					:min="1" 
					:max="stock"
					:value="quantity>stock?stock:quantity"
					:isMax="quantity>=stock?true:false"
					:isMin="quantity===1"
					:index="index"
					@eventChange="numberChange"
				></uni-number-box>
			</view>
			
			<view v-for='(item,index) in specList' :key="index" class="attr-list">
				<text>{{item.name}} </text>
				<view class="item-list">
					<text 
						v-for="(childItem, childIndex) in specChildList" 
						v-if="childItem.pid === item.id"
						:key="childIndex" class="tit"
						:class="{selected: childItem.selected}"
						@click="selectSpec(childIndex, childItem.pid)"
					>
						{{childItem.name}}
					</text>
				</view>
			</view>
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="getProduct(productid)">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addcar" >加入购物车</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		
	    props: ['productid','product'],
		components: {
			uniNumberBox
		},
		data() {
			return { 
				specList:[],
				quantity:1,
				stock:10,
				index:1,
				specSelected:null,
				specList: [],
				skuList:[],
				selectsku:{},
				specChildList: []
			}
		},
		watch:{
			productid(nwevalue){
				console.log(nwevalue);
			}
		},
		created() {
			this.getProduct(this.productid);
		},
		methods:{
			stopPrevent(){
				
			},
			toggleSpec(){
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			numberChange(){
				
			},
			selectSpec(index, pid){
				
				let list = this.specChildList;
				list.forEach(item=>{
					if(item.pid === pid){
						this.$set(item, 'selected', false);
					}
				})
				this.$set(list[index], 'selected', true);
				this.getselectsku()
			},
			//添加购物车
			addcar(){
		
				this.$emit('addcar', this.selectsku);
			},
			//立即购买
			buynow(){
				this.$emit('buynow', this.selectsku);
			},
			// 获取商品规格
			getProduct(id){
				//获取某个商品的规格,用于重选规格
				this.$request.senddata('/cart/getProduct/'+id, 'GET',{}).then(res => {
					if(res.code == 200){
						this.specList = res.data.productAttributeList;
						this.skuList = res.data.skuStockList
						let chlist = new Array()
						
						res.data.skuStockList.forEach(citem=>{
							
							let temdata1 = {pid: this.specList[0].id,name: citem.sp1}
							if(!this.ishasitem(chlist,temdata1)){
								chlist.push(temdata1)
							}
							let temdata2 = {pid: this.specList[1].id,name: citem.sp2}
							if(!this.ishasitem(chlist,temdata2)){
								chlist.push(temdata2)
							}
						})
						this.specChildList = chlist;
					}else{
						this.$api.msg(res.data);
					}
				}).catch(parmas => {
					uni.hideLoading()
					console.log("出错了"+JSON.stringify(parmas));
　　				})
			},
			//判断sku属性是否已添加到列表
			ishasitem(chlist,item){
				var ishave = false
				chlist.forEach(setitem=>{
					if(setitem.pid == item.pid && setitem.name == item.name){
						ishave =  true
					}
				})
				return ishave
			},
			getselectsku(){
				var sp1, sp2
				this.specChildList.forEach(item=>{
					if(item.selected){
						if(item.pid === this.specList[0].id){
							sp1 = item.name
						}else{
							sp2 = item.name
						}
					}
				})
				this.skuList.forEach(item=>{
					if(item.sp1 === sp1 && item.sp2 === sp2 )
						this.selectsku = item;
					}
				)
				if(!this.selectsku.pic){
					console.log(JSON.stringify(this.product))
					this.selectsku.pic = this.product.pic.split(",")[0]
					this.selectsku.price = this.product.price
					
				}
				
				
			}
		}
	}
	
</script>

<style lang='scss'>
	.speclist{
		background-color: rgba(0, 0, 0, 0.4);
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			
		}
	}


	/* 规格选择弹窗 */
	.attr-content{
		background-color: #FFFFFF;
		padding: 10upx 30upx;
		bottom: 0upx;
		width: 100%;
		position: fixed;
	
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 18upx;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
		.btn{
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	
	.item-right{
		
		position:relative;
		padding-top: 80upx;
		.uni-numbox{
			margin-left: -30upx;
		}
	}
	
	.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	
	

</style>
