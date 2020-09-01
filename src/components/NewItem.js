import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';

class NewItem extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			title: '',
		}
	}

	/**
	 * Gives values to the brand new item.
	 * 
	 * @param  {Submit} evn 
	 * @return {Void}     
	 */
	handleSubmit = (evn) => {
		evn.preventDefault();

		if (! this.state.title) {
			return;
		}

		const id = nanoid();
		
		const newItem = {
			title: this.state.title,
			completed: false,
			id: id,
		}

		this.props.onSubmit(newItem);

		this.setState({
			title: '',
		})
	}

	/**
	 * Keeps new item`s title up to date with state.
	 * 
	 * @param  {Event} evn
	 * @return {Void}
	 */
	handleChange = (evn) => {
		this.setState({
			title: evn.target.value,
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} autoComplete="off">
				<input 
					id="newItem" 
					name="newItem" 
					onChange={this.handleChange}
					value={this.state.title}
					placeholder="What I need to buy today..." 
				/>
			</form>
		);
	}
}

NewItem.propTypes = {
	onSubmit: PropTypes.func,
}

export default NewItem; 
