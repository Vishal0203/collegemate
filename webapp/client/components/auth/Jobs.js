import React, {Component} from 'react';
import {ellipsis, markdownToHtml} from '../extras/utils';
import {Divider} from 'material-ui';

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
        <div key={job.notification_guid} style={{marginTop: 20}}>
          <span style={{color:'#ECEFF1', fontWeight: 500}}>{job.notification_head}</span>
          <div className='job-desc' style={{color:'#ECEFF1', fontWeight: 300}}
               dangerouslySetInnerHTML={this.createMarkup(markdownToHtml(ellipsis(job.notification_body, 200)))}/>
          <Divider style={{margin: '10px 0'}}/>
        </div>
      )
    })
  }

  render() {
    return <div style={{marginTop: 30}}>{this.renderJob()}</div>;
  }
}

export default Jobs;
