import React from 'react';
import {hashHistory} from 'react-router';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import moment from 'moment';
import Chip from 'material-ui/Chip';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {green600} from 'material-ui/styles/colors';
import Tooltip from 'material-ui/internal/Tooltip';

class InteractionPost extends React.Component {
  constructor(props) {
    super(props);
    this.parentProps = props.parentProps;
    this.state = {
      timeTooltip: {
        show: false,
        label: ''
      }
    }
  }

  get styles() {
    return {
      postTitle: {
        paddingBottom: '2px',
        fontWeight: 400,
        fontSize: 16,
        cursor: 'pointer'
      },
      postCountContainer: {
        position: 'absolute',
        padding: '12px 16px 16px 27px',
        fontSize: 13,
        top: '12px',
        right: 0,
        bottom: 0,
        left: 0
      },
      postCountNumbers: {
        fontSize: 18
      },
      postLabel: {
        marginTop: 5,
        fontWeight: 400
      },
      notificationPublisher: {
        padding: '10px 16px 12px 16px',
        fontStyle: 'italic',
        color: '#a5a5a5',
        fontWeight: 300,
        fontSize: 13
      },
      postSubtitle: {
        textTransform: 'capitalize',
        marginTop: 6,
        color: 'rgba(0, 0, 0, 0.35)',
        fontWeight: 400,
        fontStyle: 'italic',
        fontSize: 13
      },
      chipsContainer: {
        paddingTop: 0
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chipLabel: {
        lineHeight: '24px',
        textTransform: 'capitalize',
        color: '#757575',
        fontSize: 13
      },
      chipLabelNotApproved: {
        lineHeight: '24px',
        color: '#bababa',
        textTransform: 'lowercase',
        fontSize: 8
      }
    }
  }

  timeTooltipMouseEnter(timezone, time) {
    this.setState({
      timeTooltip: {
        show: true,
        label: `${moment(time).tz(timezone).format('h:mm a, MMMM Do YYYY')}`
      }
    })
  }

  cardClick(post) {
    hashHistory.push(`/interactions/${post.post_guid}`);
  }

  renderChips(post) {
    return post.tags.map((tag, i) =>
      <Chip key={i} className="chip post-chip" labelStyle={this.styles.chipLabel}>{tag.name}
        {tag.is_approved== false && <label style={this.styles.chipLabelNotApproved}> (custom)</label>} </Chip>
    )
  }

  render() {
    const {post} = this.props;
    const timezone = moment.tz.guess();
    const time = moment.tz(post.created_at, null).format();
    const username = 'user' in post ? `${post.user.first_name} ${post.user.last_name}` : 'Anonymous';

    return (
      <Card style={{marginTop: 15, marginBottom: 15}}>
        <Row>
          <div style={{width: '20%', flexBasis: '20%', position: 'relative'}}>
            <CardText style={this.styles.postCountContainer}>
            <Row center="xs" style={{height: '100%'}}>
              <div style={{width: '50%', margin: 'auto'}}>
                <span style={this.styles.postCountNumbers}>{post.upvotes_count}</span>
                <p style={this.styles.postLabel}>votes</p>
              </div>
              <div style={{width: '50%', margin: 'auto', color: green600}}>
                <span style={this.styles.postCountNumbers}>{post.comments_count}</span>
                <p style={this.styles.postLabel}>answers</p>
              </div>
            </Row>
            </CardText>
          </div>
          <div style={{width: '80%', flexBasis: '80%'}}>
            <CardHeader
              onClick = {() => this.cardClick(post)}
              title={post.post_heading}
              subtitle={username}
              style={this.styles.postTitle}
              subtitleStyle={this.styles.postSubtitle}>
              <div className="time-container" onMouseEnter={() => this.timeTooltipMouseEnter(timezone, time)}
                   onMouseLeave={()=>{this.setState({ timeTooltip: {show: false, label: ''} }) }}>
                <label> {moment(time).tz(timezone).fromNow()} </label>
              </div>
              <Tooltip show={this.state.timeTooltip.show}
                       label={this.state.timeTooltip.label}
                       style={{right: 40, top: 14, fontSize: 12, fontWeight: 400, zIndex: 9999}}
                       horizontalPosition="left"
                       verticalPosition="bottom"
                       touch={true}
              />
            </CardHeader>
            <CardText style={this.styles.chipsContainer}>
              <div style={this.styles.chipWrapper}>
                {this.renderChips(post)}
              </div>
            </CardText>
          </div>
        </Row>
      </Card>
    );
  }
}

export default InteractionPost;