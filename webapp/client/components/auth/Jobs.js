import React, {Component} from 'react';
import {ellipsis, markdownToHtml} from '../extras/utils';
import {Divider} from 'material-ui';
import removeMd from 'remove-markdown';

class Jobs extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.getJobsRequest();
  }

  createMarkup(content) {
    return {__html: content};
  };

  renderJob() {
    const {jobs} = this.props.landing;
    return jobs.map((job) => {
      return (
        <div key={job.notification_guid} style={{margin: '10px 0'}}>
          <span style={{color:'#ECEFF1', fontWeight: 500}}>{job.notification_head}</span>
          <div className='job-desc' style={{color:'#ECEFF1', fontWeight: 300}}>
              {ellipsis(removeMd(job.notification_body), 150)}
          </div>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
        </div>
      )
    })
  }

  render() {
    return <div style={{marginTop: 30}}>{this.renderJob()}</div>;
  }
}

export default Jobs;
