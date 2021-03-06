import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row} from 'react-flexbox-grid';
import Loader from 'halogenium/ScaleLoader';
import {AnnouncementContent} from './Announcement';
import letterAvatarColors from '../../styles/theme/letterAvatarColors';
import {fetchSingleAnnouncementRequest} from '../../actions/announcements/index';
import {FlatButton, Dialog} from 'material-ui';

class AnnouncementDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const institute_guid = this.props.auth_user.selectedInstitute.inst_profile_guid;
    let url = `institute/${institute_guid}/notification/${this.props.announcement}`;
    this.props.actions.fetchSingleAnnouncementRequest(url)
  }

  getAvatarColor() {
    const index = Math.floor(Math.random() * letterAvatarColors.length);
    return letterAvatarColors[index];
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.props.handleClose}
      />
    ];

    const loader = (
      <div style={{marginTop: '70px', marginBottom: '50px'}}>
        <Row center="xs">
          <Loader color="#126B6F" size="10px" margin="5px"/>
        </Row>
      </div>
    );

    const {singleAnnouncement, singleAnnouncementLoader} = this.props.announcements;
    let dialogContent = (singleAnnouncementLoader || singleAnnouncement === null) ?
      loader :
      (<AnnouncementContent parentProps={this.props}
                            announcement={singleAnnouncement}
                            avatarColor={this.getAvatarColor(singleAnnouncement.category.category_type)}/>);
    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
      >
        {dialogContent}
      </Dialog>
    );
  }
}


function mapStateToProps(state) {
  return {
    announcements: state.announcements
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      fetchSingleAnnouncementRequest
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementDialog);