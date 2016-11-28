'use strict';

// TODO Used persistent Channel Storage for past Transactions

const EventEmitter = require('events');

const TransactionWatcher = class TransactionWatcher extends EventEmitter {
	
	constructor(api, leagueId, opts) {
		super();

		this.api = api;
		this.leagueId = leagueId;
		
		// Options and Defaults
		const defaults = {
			allowedTypes: ['add/drop', 'add', 'drop', 'trade'],
			refreshInterval: 30,
		};
		this.options = Object.assign(defaults, opts);
		
		this.interval = null;
		
		this.pastTrans = [];
	}
	
	setLeagueId(id) {
		this.leagueId = id;
	}
	
	start() {		
		console.log('TransactionWatcher::start()', this.leagueId, this.options);		
		this._fetch();
		this.interval = setInterval(this._fetch.bind(this), this.options.refreshInterval * 1000);		
	}
	
	stop() {
		console.log('TransactionWatcher::stop()', this.leagueId);		
		if (this.interval) {
			clearInterval(this.interval);
		}
	}
		
	_fetch() {
		console.log('TransactionWatcher::_fetch()', this.leagueId);
		this.api.league.transactions(
			this.leagueId,
			this._fetchCB.bind(this)
		);
	}
	
	_fetchCB(err, data) {
		if (err) {
			console.log(err);
			throw new Error ('Could not fetch Transaction Data', this.leagueId);
		}
		
		if (data.transactions) {
			// If difference in size, extract
			// console.log("PAST TRANS:", this.pastTrans);
			console.log(
                "LENGTHS: Past: %d, Fetched: %d",
                this.pastTrans.length,
                data.transactions.length
            );
			if (data.transactions.length > this.pastTrans.length) {
				
				// If not the first time, extract new ones
				if (this.pastTrans.length > 0) {
					this._extractNewTransactions(data.transactions);
				} else {
					// else, just save all IDs in the past list
					data.transactions.forEach((t) => {
						this.pastTrans.push(t.transaction_key);
					})
				}
				
			} 
		}
	}
	
	_extractNewTransactions(transactions) {
		
		transactions.forEach((t) => {
			const key = t.transaction_key;
			
			// If transaction has not already been parsed, is the correct type
			if (this.pastTrans.indexOf(key) === -1 && this.options.allowedTypes.indexOf(t.type) > -1 ) {
                this.pastTrans.push(key);
				this.emit('new_transaction', t);				
			}
            
		});
		
	}

};

module.exports = TransactionWatcher;
