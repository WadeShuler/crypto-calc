<template>
<div class="container">
    <div class="row justify-content-center">
        <div id="main_content" class="col col-lg-5 mt-5">

            <div class="row">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="sharesEstimateTab" data-bs-toggle="tab" data-bs-target="#sharesEstimatePane" type="button" role="tab" aria-controls="sharesEstimatePane" aria-selected="true">
                            Shares
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="profitEstimateTab" data-bs-toggle="tab" data-bs-target="#profitEstimatePane" type="button" role="tab" aria-controls="profitEstimatePane" aria-selected="false">
                            Projection
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="reverseTab" data-bs-toggle="tab" data-bs-target="#reversePane" type="button" role="tab" aria-controls="reversePane" aria-selected="false">
                            Reverse
                        </button>
                    </li>
                </ul>
            </div>

            <div class="row">
                <div class="tab-content bg-gray" id="myTabContent">

                    <div class="tab-pane fade show active p-4 text-white" id="sharesEstimatePane" role="tabpanel" aria-labelledby="sharesEstimateTab">
                        <p>How many shares can I buy with x amount?</p>
                        <form>
                            <div class="mb-3">
                                <label for="amountToSpendInput" class="form-label">Amount</label>
                                <input type="number" inputmode="decimal" pattern="[0-9]*" min="0.0" id="amountToSpendInput" class="form-control" v-model="estimateShares.amountToSpend" placeholder="100" />
                            </div>
                            <div class="mb-3">
                                <label for="pricePerShareInput" class="form-label">Price per Share</label>
                                <input type="number" inputmode="decimal" pattern="[0-9]*" min="0.0" id="pricePerShareInput" class="form-control" v-model="estimateShares.pricePerShare" placeholder="2.50" />
                            </div>

                            <div class="mt-4">
                                <p class="text-white">
                                    <strong>Result:</strong>
                                    <span id="numOfSharesResult" class="ps-2 text-green">{{ numOfSharesResult }}</span>
                                    <span v-if="hasNumOfShares" class="ps-2"><a href="#" @click.prevent.stop="copyNumOfSharesResult"><i class="fas fa-copy"></i></a></span>
                                    <span v-else><i class="fas fa-copy" style="opacity:0;"></i></span>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div class="tab-pane fade show p-4 text-white" id="profitEstimatePane" role="tabpanel" aria-labelledby="profitEstimateTab">
                        <p>How much will my shares be worth if it hits x amount?</p>
                        <form>
                            <div class="mb-3">
                                <label for="numOfSharesInput" class="form-label"># of Shares</label>
                                <input type="number" inputmode="decimal" pattern="[0-9]*" min="0.0" id="numOfSharesInput" class="form-control" v-model="estimateProfit.numShares" placeholder="125" />
                            </div>
                            <div class="mb-3">
                                <label for="projectedPriceInput" class="form-label">Projected Price</label>
                                <input type="number" inputmode="decimal" pattern="[0-9]*" min="0.0" id="projectedPriceInput" class="form-control" v-model="estimateProfit.projectedPrice" placeholder="2.50" />
                            </div>
                            <div class="mt-4">
                                <p class="text-white">
                                    <strong>Result:</strong>
                                    <span class="ps-2 text-green">{{ estimateProfitResult }}</span>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div class="tab-pane fade p-4 text-white" id="reversePane" role="tabpanel" aria-labelledby="reverseTab">
                        <p>Reverse calculate the price per share after purchase.</p>
                        <form>
                            <div class="mb-3">
                                <label for="amountSpentInput" class="form-label">Amount</label>
                                <input type="number" inputmode="decimal" pattern="[0-9]*" min="0.0" id="amountSpentInput" class="form-control" v-model="calculatePricePerShare.amountSpent" placeholder="123.45" />
                            </div>
                            <div class="mb-3">
                                <label for="numOfSharesBoughtInput" class="form-label"># of Shares</label>
                                <input type="number" inputmode="decimal" pattern="[0-9]*" min="0.0" id="numOfSharesBoughtInput" class="form-control" v-model="calculatePricePerShare.numSharesBought" placeholder="10250" />
                            </div>

                            <div class="mt-4">
                                <p class="text-white">
                                    <strong>Result:</strong>
                                    <span id="numOfSharesBoughtResult" class="ps-2 text-green">{{ numOfSharesBoughtResult }}</span>
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>
</template>

<script>
const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})

export default {
    data() {
        return {
            'estimateProfitResult': '$0.00',
            'numOfSharesResult': '0',
            'numOfSharesBoughtResult': '0',

            'estimateProfit': {
                'numShares': '',
                'projectedPrice': '',
            },

            'estimateShares': {
                'amountToSpend': '',
                'pricePerShare': '',
            },

            'calculatePricePerShare': {
                'amountSpent': '',
                'numSharesBought': '',
            },

        }
    },
    computed: {
        hasNumOfShares() {
            return (this.numOfSharesResult > 0) ? true : false;
        },
    },

    watch: {

        estimateProfit: {
            deep: true,
            handler() {
                this.recalculateEstimatedProfit();
            }
        },

        estimateShares: {
            deep: true,
            handler() {
                this.recalculateEstimatedShares();
            }
        },

        calculatePricePerShare: {
            deep: true,
            handler() {
                this.recalculatePricePerShare();
            }
        },

    },

    methods: {
        copyNumOfSharesResult() {
            var range_ = document.createRange(); // create new Range object
            range_.selectNode(document.getElementById("numOfSharesResult")); // set our Range to contain the Node we want to copy from
            window.getSelection().removeAllRanges(); // remove any previous selections
            window.getSelection().addRange(range_); // select
            document.execCommand("copy"); // copy to clipboard
            window.getSelection().removeAllRanges(); // remove selection
        },

        bak_copyNumOfSharesResult() {
            var copyText = document.getElementById("numOfSharesResultInput");

            copyText.select();
            copyText.setSelectionRange(0, 99999999999999999999999); /* For mobile devices */

            /* Copy the text inside the text field */
            document.execCommand("copy");
            console.log('copied!');
        },

        recalculateEstimatedProfit() {
            if ( (this.estimateProfit.numShares > 0) && (this.estimateProfit.projectedPrice > 0) ) {
                var res = this.estimateProfit.numShares * this.estimateProfit.projectedPrice;
                this.estimateProfitResult = formatter.format(res);
            } else {
                this.estimateProfitResult = formatter.format(0.00);
            }
        },

        recalculateEstimatedShares() {
            if ( (this.estimateShares.amountToSpend > 0) && (this.estimateShares.pricePerShare > 0) ) {
                var res = this.estimateShares.amountToSpend / this.estimateShares.pricePerShare;
                this.numOfSharesResult = res;
            } else {
                this.numOfSharesResult = 0;
            }
        },

        recalculatePricePerShare() {
            if ( (this.calculatePricePerShare.amountSpent > 0) && (this.calculatePricePerShare.numSharesBought > 0) ) {
                var res = this.calculatePricePerShare.amountSpent / this.calculatePricePerShare.numSharesBought;
                this.numOfSharesBoughtResult = res;
            } else {
                this.numOfSharesBoughtResult = 0;
            }
        },
    },
}
</script>
