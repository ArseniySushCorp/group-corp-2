import React, {Component} from 'react'
import Messenger from '../Messenger/Messenger'
import ChatList from '../../components/ChatList/ChatList'
import { Grid } from '@material-ui/core'
import Header from '../../components/Header/Header'
import {Route, Switch} from 'react-router-dom'
import HomePage from '../../pages/HomePage/HomePage'
import ProfilePage from '../../pages/ProfilePage/ProfilePage'
import {connect} from 'react-redux'
import {addNewChat, addNewMessage, chatsLoad} from '../../store/actions/chats'
import {profileLoad} from '../../store/actions/profile'
import {push} from 'connected-react-router'

class Layout extends Component {

	componentDidMount() {
		if (this.props.chatsList.length === 0){
			this.props.chatsLoad()
		}
		this.props.profileLoad()
	}

	render() {
		return (
			<Grid container >
				<Grid
					container
					direction = 'row'
					justify = 'center'
					alignItems = 'flex-start'
				>

					<Header profileInfo = { this.props.profileInfo }/>

				</Grid>

				<Grid
					container
					direction = 'row'
					justify = 'center'
					alignItems = 'flex-start'
				>
					<ChatList
						addChat = { this.props.addNewChat }
						chats = { this.props.chatsList }
						chatRedirect = { this.props.chatRedirect }
						setChatId = { this.props.setChatId }
					/>

					<Switch>
						<Route
							exact
							path = '/profile'
							render = { () => <ProfilePage profileInfo = { this.props.profileInfo } /> }
						/>

						<Route
							exact
							path = '/'
							component = { HomePage }
						/>

						<Route
							exact
							path = '/chat/:id'
							render = {
								renderProps =>
									<Messenger
										{ ...renderProps }
										chats = { this.props.chatsList }
										lastAuthor = { this.props.lastAuthor }
										handleMessageSend = { this.props.addNewMessage }
									/>
							}
						/>
					</Switch>
				</Grid>
			</Grid>
		)
	}
}

function mapStateToProps(state) {
	return {
		setChatId: state.chats.setChatId,
		chatsList: state.chats.chatsList,
		lastAuthor: state.chats.lastAuthor,
		profileInfo: state.profile.profileInfo
	}
}

function mapDispatchToProps(dispatch) {
	return {
		chatsLoad: () => dispatch(chatsLoad()),
		profileLoad: () => dispatch(profileLoad()),
		addNewChat: chat => dispatch(addNewChat(chat)),
		addNewMessage: (message, chat) => dispatch(addNewMessage(message, chat)),
		chatRedirect: chatId => dispatch(push(`/chat/${chatId}`)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
