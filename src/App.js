import React, { Component } from 'react';
import './App.css';
import NewItem from './components/NewItem';
import Item from './components/Item';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			filter: 'all',
		}
	}

	componentDidMount() {
		const items = JSON.parse(localStorage.getItem("items"));
		this.updateItems(items);
	}

	/**
	 * Takes care of keeping data in local storage.
	 * 
	 * @param  {Array} updatedItems 
	 * @return {Void}              
	 */
	updateItems = (updatedItems) => {
		localStorage.setItem("items", JSON.stringify(updatedItems));

		this.setState({
			items: updatedItems || [],
		});
	}

	/**
	 * Makes sure the new item is added to the list.
	 * 
	 * @param  {Object} newItem 
	 * @return {Void}         
	 */
	handleSubmit = (newItem) => {
		this.updateItems([
			...this.state.items, 
			newItem
		]);
	}

	/**
	 * Makes sure that toggle button completes items in correct behaviour.
	 * 
	 * @return {Void} 
	 */
	toggleCompleteAll = () => {
		const completed = this.state.items.filter(item => item.completed);
		
		const items = this.state.items.map(item => {
			if (item.completed && completed.length !== this.state.items.length){
				item.completed = false;	
			}

			return {
				...item,
				completed: !item.completed,
			}
		}); 

		this.updateItems(items);
	}

	/**
	 * Keeps track of current filter state. [Called in FilterButonns]
	 * 
	 * @param  {onClick} evn 
	 * @return {Void}       
	 */
	handleFilter = (evn) => {
		evn.preventDefault();
		this.setState({
			filter: evn.target.name,
		})
	}

	/**
	 * Clears all completed items.
	 * 
	 * @return {Void}
	 */
	handleClearCompleted = () => {
		const items = this.state.items.filter(item => !item.completed);

		this.updateItems(items);
	}

	/**
	 * Toggles single item completion state. [ Called in Item ]
	 * 
	 * @param  {String} id 
	 * @return {Void}    
	 */
	toggleItemCompleted = (id) => {
		const items = this.state.items.map((item) => {
			if (item.id === id) {
				return {
					...item,
					completed: ! item.completed
				}
			}

			return item;
		});
		// const item = items.find(item => item.id === id);
		// item.completed = !item.completed;

		this.updateItems(items);
	}

	/**
	 * Handles removal of single item.
	 * 
	 * @param  {[type]} id 
	 * @return {[type]}    
	 */
	handleDeleteItem = (id) => {
		this.updateItems(this.state.items.filter(item => item.id !== id));
	};

	/**
	 * Makes sure to set the title of item with the new value.
	 * 
	 * @param  {String} id    
	 * @param  {String} value 
	 * @return {Void}       
	 */
	handleSubmitUpdate = (id, value) => {
		const items = this.state.items.map(item => {
			if (item.id === id) {
				return  {
					...item, 
					title: value ? value : this.state.title
				}
			}

			return item;
		});

		this.updateItems(items);
	};

	/**
	 * Get filtered items for given filter.
	 * 
	 * @param  {String} filter 
	 * @return {Void}
	 */
	getItemsForFilter = (filter) => {
		const { items } = this.state;

		if (filter === 'all') {
			return items;
		} else if (filter === 'active') {
			return items.filter(item => !item.completed);
		} else if (filter === 'completed') {
			return items.filter(item => item.completed);;
		}
	}

	render() {
		const { items, filter } = this.state;
		const activeItems = items.filter(item => !item.completed);
		const completedItems = items.filter(item => item.completed);
		const itemsLeftSuffix = activeItems.length === 1 ? '' : 's';
		const displayItems = this.getItemsForFilter(filter);
		const svg =
			<span className='svg__tick'>
				<svg width="25" height="18.3" viewBox="0 0 85 121" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1 73.6498C3.33375 86.5919 6.04699 98.8509 12.0545 110.647C12.1938 110.921 17.2222 120.84 18.8948 119.943C20.166 119.261 20.973 117.908 21.7653 116.702C23.9157 113.427 25.782 109.972 27.6895 106.55C35.8141 91.9735 43.6307 77.2268 51.6306 62.5811C62.776 42.1769 73.4994 21.6998 84 1" stroke="green" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
				</svg>
			</span>
		return (
			<div className='app'>
				<h1 className="app__title">My Shopping List</h1>
				<div className="app__body">
					<div className="shopping__list">
						<div className="shopping__list__header">
							<div className={items.length === 0 ? 'not-allowed' : ''}>
								<button 
									onClick={this.toggleCompleteAll} 
									className={`${items.length > 0 ? 'toggleCompleteAll' : 'disabled'} ${completedItems.length === items.length ? 'active' : ''}`}
								>
									{completedItems.length === items.length && items.length > 0 ? svg : ''}
								</button>
							</div>

							<NewItem onSubmit={this.handleSubmit} />
						</div>
						
						{displayItems.length === 0 ? (  
							<div className="no__items">
							 	<p>No items here.</p>
							</div>
						) : (
							<ul>
								{displayItems.map(item => {
									return (
										<Item 
											key={item.id} 
											id={item.id}
											svg={svg}
											completed={item.completed}
											title={item.title}
											handleDeleteItem={this.handleDeleteItem}
											toggleItemCompleted={this.toggleItemCompleted}
											handleSubmitUpdate={this.handleSubmitUpdate} 
										/>
									)
								})}
							</ul>
						)}

						<div className="footer">
							<div>{activeItems.length} item{itemsLeftSuffix} left.</div>
							<div className="footer__buttons">
								<button name='all' onClick={this.handleFilter} className={filter === 'all' ? 'active' : ''}>all</button>
								<button name='active' onClick={this.handleFilter} className={filter === 'active' ? 'active' : ''}>active</button>
								<button name='completed' onClick={this.handleFilter} className={filter === 'completed' ? 'active' : ''}>completed</button>
							</div>
							<div className={items.length === 0 ? 'clearBtn__not-allowed' : ''}>
								<button 
								onClick={this.handleClearCompleted} 
								className={items.length === 0 ? 'clearBtn__disabled' : 'clearBtn' }>
								Clear Completed
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
