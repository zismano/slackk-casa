import React from 'react';
import { updatePoll } from '../socketHelpers';

class PollOption extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick() {
		if (!this.props.option.users.includes(this.props.currentUser)) {
			this.props.option.count++;
			this.props.option.users.push(this.props.currentUser);		
		} else {
			this.props.option.count--;
			const userIndex = this.props.option.users.indexOf(this.props.currentUser);
			this.props.option.users.splice(userIndex, 1);
		}
		updatePoll(this.props.data, this.props.currentWorkSpaceId, this.props.messageId);
		this.forceUpdate();
	}

	render() {
		let { option, } = this.props;
		let count = '';
		let usersVoted = '';
		if (option.count > 0) {
			count = ` + ${option.count}`;
			usersVoted = option.users.join(',');
		}
		return (
			<li onClick={() => this.handleClick()}> {option.name}{count} <div>{usersVoted}</div> </li>
		)
	}
}

export default PollOption