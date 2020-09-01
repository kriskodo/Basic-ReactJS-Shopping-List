import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.title,
			isChanging: false,
		}
	}
	
	/**
	 * Allows user to change item`s title.
	 * 
	 * @param  {onDoubleClick} evn 
	 * @return {Void}     
	 */
	updateItem = (evn) => {
		this.setState({
			isChanging:true,
		})
	}

	/**
	 * Makes sure to keep track of current item`s title.
	 * 
	 * @param  {onChange} evn 
	 * @return {Void}     
	 */
	handleChange = (evn) => {
		this.setState({
			title: evn.target.value,
		})
	}

	handleBlur = (e) => {
		this.setState({
			title: this.state.title || this.props.title,
			isChanging: false
		});
	}

	/**
	 * Keeps track of item`s title state.
	 * 
	 * @param  {String} id  
	 * @param  {onSubmit} evn 
	 * @return {Void}     
	 */
	handleSubmitUpdate = (id, evn) => {
		evn.preventDefault();
		const title = this.state.title || this.props.title;
		this.setState({
			title,
			isChanging: false,
		})
		this.props.handleSubmitUpdate(this.props.id, title);
	}

	render() {
		const { id, completed, toggleItemCompleted, handleDeleteItem } = this.props;

		return (
			<li 
				id={`id: ${id}`} 
				key={id}
				>
				<button 
					className='complete__btn'
					onClick={toggleItemCompleted.bind(this, id)}>
				{completed ? this.props.svg : ''}
				</button> 
				<span 
					id={id}
					className={completed ? 'item__text completed' : "item__text"} 
					onDoubleClick={this.updateItem}
					ref={node => this.node = node}>
					{this.state.isChanging ? (
						<form onSubmit={this.handleSubmitUpdate.bind(this, id)} autoComplete='off'>
							<input 
								type="text" 
								autoFocus={true}
								onChange={this.handleChange} 
								onBlur={this.handleBlur}
								value={this.state.title}
							/>
						</form>
					) : (
						this.state.title
					)}
				</span>
				<button 
					className="trash__icon" 
					onClick={handleDeleteItem.bind(this, id)}>
					🗑
				</button>
			</li>
		);
	}
}

Item.propTypes = {
	id: PropTypes.string,
	completed: PropTypes.bool,
	title: PropTypes.string,
	handleDeleteItem: PropTypes.func,
	toggleItemCompleted:PropTypes.func,
	handleSubmitUpdate: PropTypes.func,
}

export default Item;
