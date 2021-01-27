import { connect } from 'react-redux';
import { openModal, closeModal} from '../../actions/modal_actions';
import { receiveErrors } from '../../actions/session_actions';
import SplashPage from './splash_page';

const mapStateToProps = (state) => ({
  errors: state.errors.session,
});

const mapDispatchToProps = (dispatch) => ({
  openModal: modal => dispatch(openModal(modal)),
  clearErrors: () => dispatch(receiveErrors({}))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashPage);