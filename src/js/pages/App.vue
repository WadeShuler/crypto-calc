<template>
<div class="container">
    <div class="row justify-content-center">
        <div id="main_content" class="col col-lg-5 mt-5">

            <div class="row">
                <ul class="nav nav-tabs" id="myTab" role="tablist">

                    <!-- SHARES -->
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="sharesEstimateTab" data-bs-toggle="tab" data-bs-target="#sharesEstimatePane" type="button" role="tab" aria-controls="sharesEstimatePane" aria-selected="true">
                            Shares
                        </button>
                    </li>

                    <!-- PROJECTION -->
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="profitEstimateTab" data-bs-toggle="tab" data-bs-target="#profitEstimatePane" type="button" role="tab" aria-controls="profitEstimatePane" aria-selected="false">
                            Projection
                        </button>
                    </li>

                    <!-- REVERSE -->
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="reverseTab" data-bs-toggle="tab" data-bs-target="#reversePane" type="button" role="tab" aria-controls="reversePane" aria-selected="false">
                            Reverse
                        </button>
                    </li>

                </ul>
            </div>

            <div class="row">
                <div class="tab-content bg-gray" id="myTabContent">

                    <!-- SHARES -->
                    <div class="tab-pane fade show active p-4 text-white" id="sharesEstimatePane" role="tabpanel" aria-labelledby="sharesEstimateTab">
                        <p>How many shares can I buy with x amount?</p>
                        <form>
                            <div class="mb-3">
                                <label for="amountToSpendInput" class="form-label">Amount</label>
                                <input type="text" inputmode="decimal" pattern="[0-9]*" min="0.0" id="amountToSpendInput" class="form-control" v-model="estimateSharesForm.amount" placeholder="100" />
                            </div>
                            <div class="mb-3">
                                <label for="pricePerShareInput" class="form-label">Price per Share</label>
                                <input type="text" inputmode="decimal" pattern="[0-9]*" min="0.0" id="pricePerShareInput" class="form-control" v-model="estimateSharesForm.price" placeholder="2.50" />
                            </div>

                            <div class="row mt-4">
                                <div class="col-3 text-white">
                                    <strong>Result:</strong>
                                </div>
                                <!-- 0.0000000000000001475 -->
                                <div class="col-9">
                                    <span id="numOfSharesResult" class="text-green">{{ estimateSharesResults.string }}</span>
                                    <span v-if="hasNumOfShares" class="ps-2"><a href="#" @click.prevent.stop="copyNumOfSharesResult"><i class="fas fa-copy"></i></a></span>
                                    <span v-else><i class="fas fa-copy" style="opacity:0;"></i></span>

                                    <br>

                                    {{ estimateSharesResults.result }}

                                    <br>

                                    {{ estimateSharesResults.scale }}
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- PROJECTION -->
                    <div class="tab-pane fade show p-4 text-white" id="profitEstimatePane" role="tabpanel" aria-labelledby="profitEstimateTab">
                        <p>How much will my shares be worth if it hits x amount?</p>
                        <form>
                            <div class="mb-3">
                                <label for="numOfSharesInput" class="form-label"># of Shares</label>
                                <input type="text" inputmode="decimal" pattern="[0-9]*" min="0.0" id="numOfSharesInput" class="form-control" v-model="estimateProfitForm.shares" placeholder="125" />
                            </div>
                            <div class="mb-3">
                                <label for="projectedPriceInput" class="form-label">Projected Price</label>
                                <input type="text" inputmode="decimal" pattern="[0-9]*" min="0.0" id="projectedPriceInput" class="form-control" v-model="estimateProfitForm.price" placeholder="2.50" />
                            </div>
                            <div class="row mt-4 text-white">
                                <div class="col-3 text-white">
                                    <strong>Result:</strong>
                                </div>
                                <div class="col-9">
                                    <span class="text-green">{{ estimateProfitResults.result ? '$' + estimateProfitResults.result : '' }}</span>

                                    <br>

                                    {{ estimateProfitResults.scale }}

                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- REVERSE -->
                    <div class="tab-pane fade p-4 text-white" id="reversePane" role="tabpanel" aria-labelledby="reverseTab">
                        <p>Reverse calculate the price per share after purchase.</p>
                        <form>
                            <div class="mb-3">
                                <label for="amountSpentInput" class="form-label">Amount Spent</label>
                                <input type="text" inputmode="decimal" pattern="[0-9]*" min="0.0" id="amountSpentInput" class="form-control" v-model="estimatePricePerShareForm.amount" placeholder="123.45" />
                            </div>
                            <div class="mb-3">
                                <label for="numOfSharesBoughtInput" class="form-label"># of Shares</label>
                                <input type="text" inputmode="decimal" pattern="[0-9]*" min="0.0" id="numOfSharesBoughtInput" class="form-control" v-model="estimatePricePerShareForm.shares" placeholder="10250" />
                            </div>

                            <div class="row mt-4">
                                <div class="col-3 text-white">
                                    <strong>Result:</strong>
                                </div>
                                <div class="col-9">
                                    <span class="text-green">{{ estimatePricePerShareResults.result }}</span>

                                    <br>

                                    {{ printNumberOfZeros(estimatePricePerShareResults.zeros) }}
                                </div>
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
export default {
    data() {
        return {

            // -----------------------
            // -------- SHARES -------
            // -----------------------

            'estimateSharesForm': {
                'amount': '',
                'price': '',
            },

            'estimateSharesResults': {
                'raw': '',
                'string': '',
                'result': '',
                'scale': '',
            },


            // -----------------------
            // ------ PROJECTION -----
            // -----------------------

            'estimateProfitForm': {
                'shares': '',
                'price': '',
            },

            'estimateProfitResults': {
                'raw': '',
                'string': '',
                'result': '',
                'scale': '',
            },


            // -----------------------
            // ------- REVERSE -------
            // -----------------------

            'estimatePricePerShareForm': {
                'amount': '',
                'shares': '',
            },

            'estimatePricePerShareResults': {
                'raw': '',
                'string': '',
                'result': '',
                'zeros': '',
                // scale  not applicable
            },


            // --


            // 0.0000000000000001482

            // projection tab
            // 0.0000000000000001482 * 2.23 = 1504723346828609985
            // im getting: 1,504,723,346,828,609,800

            // ---
        }
    },

    mounted() {
        Big.DP = 40;
    },

    computed: {
        hasNumOfShares() {
            return (this.estimateSharesResults.raw > 0) ? true : false;
        },
    },

    watch: {

        estimateSharesForm: {
            deep: true,
            handler() {
                this.handleEstimateSharesFormUpdate();
            }
        },

        estimateProfitForm: {
            deep: true,
            handler() {
                this.handleEstimateProfitFormUpdate();
            }
        },

        estimatePricePerShareForm: {
            deep: true,
            handler() {
                this.handleEstimatePricePerShareFormUpdate();
            }
        },

    },

    methods: {
        // --------------------------------
        //    Reset Form Results Methods
        // --------------------------------

        resetEstimateSharesResults() {
            this.estimateSharesResults = {
                'raw': '',
                'string': '',
                'result': '',
                'scale': '',
            };
        },

        resetEstimateProfitResults() {
            this.estimateProfitResults = {
                'raw': '',
                'string': '',
                'result': '',
                'scale': '',
            };
        },

        resetEstimatePricePerShareResults() {
            this.estimatePricePerShareResults = {
                'raw': '',
                'string': '',
                'result': '',
                'zeros': '',
                // scale  not applicable
            }
        },

        // ----------------------------
        //    Watcher Update Methods
        // ----------------------------

        handleEstimateSharesFormUpdate() {
            if ( this.estimateSharesForm.amount && this.estimateSharesForm.price ) {
                if ( this.estimateSharesForm.amount > 0 && this.estimateSharesForm.price > 0 ) {
                    console.log('-- handleEstimateSharesFormUpdate() --');
                    this.recalculateEstimateSharesForm();
                    return;
                }
            }

            this.resetEstimateSharesResults();
        },

        handleEstimateProfitFormUpdate() {
            if ( this.estimateProfitForm.shares && this.estimateProfitForm.price ) {
                if ( (this.estimateProfitForm.shares > 0) && (this.estimateProfitForm.price > 0) ) {
                    console.log('-- handleEstimateProfitFormUpdate() --');
                    this.recalculateEstimateProfitForm();
                    return;
                }
            }

            //this.estimateProfitResult = formatter.format(0.00);
            //this.estimateProfitResultScale = '';
            this.resetEstimateProfitResults();
        },

        handleEstimatePricePerShareFormUpdate() {
            if ( this.estimatePricePerShareForm.amount && this.estimatePricePerShareForm.shares ) {
                if ( (this.estimatePricePerShareForm.amount > 0) && (this.estimatePricePerShareForm.shares > 0) ) {
                    console.log('-- handleEstimatePricePerShareFormUpdate() --');
                    this.recalculateEstimatePricePerShareForm();
                    return;
                }
            }

            //this.numOfSharesBoughtResult = 0;
            this.resetEstimatePricePerShareResults();
        },

        // --------------------------------
        //     Recalculate Form Methods
        //  (triggered by watcher methods)
        // --------------------------------

        recalculateEstimateSharesForm() {
            console.log('-- recalculateEstimateSharesForm() --');

            let amount = new Big(this.estimateSharesForm.amount);
            let price = new Big(this.estimateSharesForm.price);

            let res = amount.div(price).toFixed(5);

            this.estimateSharesResults.raw = res;
            this.estimateSharesResults.string = res.toString();
            this.estimateSharesResults.result = this.formatWithCommas(res);
            this.estimateSharesResults.scale = this.determineScaleName(this.estimateSharesResults.result);
        },

        recalculateEstimateProfitForm() {
            let shares = new Big(this.estimateProfitForm.shares);
            let price = new Big(this.estimateProfitForm.price);
            let res = shares.times(price).toFixed(2);

            this.estimateProfitResults.raw = res;
            this.estimateProfitResults.string = res.toString();
            this.estimateProfitResults.result = this.formatWithCommas(res);
            this.estimateProfitResults.scale = this.determineScaleName(this.estimateProfitResults.result);
        },

        recalculateEstimatePricePerShareForm() {
            let amount = new Big(this.estimatePricePerShareForm.amount);
            let shares = new Big(this.estimatePricePerShareForm.shares);

            let res = amount.div(shares).toFixed(40);

            this.estimatePricePerShareResults.raw = res;
            this.estimatePricePerShareResults.string = res.toString();

            let zeros = this.countDecimalLeadingZeros(this.estimatePricePerShareResults.string);
            this.estimatePricePerShareResults.zeros = zeros;
            this.estimatePricePerShareResults.result = this.formatDecimalWithZeros(this.estimatePricePerShareResults.string, zeros);
        },

        // ----------------------
        //     Helper Methods
        // ----------------------

        /*
         * Adds commas to normal digits like 123456789 => 123,456,789
         * Not for currency, but for number of shares. Preserves decimals.
         */
        formatWithCommas(value) {
            if ( ! value ) {
                return;
            }

            console.log('-- formatWithCommas() --');
            console.log('format with commas initial value:', value);

            let split = value.split(".");   // split whole from decimal
            let whole = split[0];
            console.log('whole: ' + whole);
            let decimal = split[1] ?? null;
            console.log('decimal: ' + decimal);

            let wholeWithCommas = this.addCommas(whole);
            console.log('whole with commas:', wholeWithCommas);

            if ( decimal === null ) {
                return wholeWithCommas;
            }

            return wholeWithCommas + '.' + decimal;
        },

        /**
         * Format a decimal number with leading zeros
         *
         * Since our decimals can be up to 40 digits, we can end up with way more digits than we need. This
         * allows us to keep the first 4 non-zero digits after all the leading zeros. You will need to get
         * and pass the number of zeros by using the `countDecimalLeadingZeros()` method.
         *
         * Before: `0.0000001988876543456787654345678987654323` (40 decimal digits, 6 leading 0s)
         * After:  `0.0000001988`   (10 decimal digits, 6 leading 0s)
         *
         * This is not for use with whole numbers, as in `1.00457`. Value must be > 0, but < 1.
         * The intended use is for coins that are fractions of a penny, ie: `0.00000353` or `0.00234`.
         */
        formatDecimalWithZeros(value, zeros) {
            value = new Big(value);

            let max = 40;           // same as DP
            let count = zeros + 4;

            if ( count > max ) {
                count = max;
            }

            return value.toFixed(count).toString();
        },

        /**
         * Add commas to numbers
         *
         * Numbers must be whole numbers, not decimals. You may need to split the number at the decimal,
         * run the whole number part through this method, and combine the result back to the decimal portion.
         */
        addCommas(num) {
            if (num === null) return;

            return (
                num
                .toString()
                .split("")
                .reverse()
                .map((digit, index) =>
                    index != 0 && index % 3 === 0 ? `${digit},` : digit
                )
                .reverse()
                .join("")
            );
        },

        // used by determineScaleName
        countCommas(value) {
            //value = value.toString();
            return value.toString().split(",").length - 1;
        },

        determineScaleName(number) {
            const commasCount = this.countCommas(number);

            const scale = new Map([
                [0, 'hundred'],
                [1, 'thousand'],
                [2, 'million'],
                [3, 'billion'],
                [4, 'trillion'],
                [5, 'quadrillion'],
                [6, 'quintillion'],
                [7, 'sextillion'],
                [8, 'septillion'],
                [9, 'octillion'],
            ]);

            return scale.get(commasCount) || '';
        },

        countDecimalLeadingZeros(value) {
            if ( ! value ) return 0;

            let split = value.split(".");   // split whole from decimal
            let whole = split[0];
            let decimal = split[1] ?? null;

            if (whole != '0') {
                return 0;
            }

            return (decimal.match(/^0+/) || [''])[0].length;
        },

        printNumberOfZeros(zeros) {
            if ( ! zeros ) return '';

            return ( zeros === 1 ) ? '1 zero' : zeros + ' zeros';
        },


        // --



        // @TODO There is a better way that came across my feed (twitter/google). did I save/favorite/rt/bookmark it?
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
    },
}
</script>
