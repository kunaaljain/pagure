clean_entry= function(text, element) {
  var _out = []
  var _data = $.trim(text).split(',');
  var y=0;
  for (var j=0; i<_data.length; i++){
    if ($.trim(_data[j]) == element) {
      continue;
    }
    _out[y] = $.trim(_data[j]);
    y+=1;
  }
  return _out;
}

add_tags = function(data, _issues_url) {
  console.log('adding ' + data.added_tags);
  var field = $('#taglist');
  var field2 = $('#tag');
  var _data = field.html();
  var _curval = field2.val();

  for (i=0; i<data.added_tags.length; i++ ){
    tag = data.added_tags[i]
    _data += ',' + _issues_url + '?tags=' + tag + '">' + tag + '</a>';

    if (_curval) {
      _curval += ',';
    }
    _curval += tag;
  }

  field.html(_data);
  field2.val(_curval);
}

remove_tags = function(data, _issues_url) {
  console.log('removing ' + data.removed_tags);
  var field = $('#taglist');
  var field2 = $('#tag');
  var _data = field.html();
  var _data2 = field2.val();
  for (var i=0; i<data.removed_tags.length; i++ ){
    tag = data.removed_tags[i]
    var _turl = _issues_url + '?tags=' + tag + '">' + tag + '</a>';
    _data = clean_entry(_data, _turl).join();
    _data2 = clean_entry(_data2, tag).join();
  }
  field.html(_data);
  field2.val(_data2);
}

assigne_issue = function(data, _issues_url) {
  console.log('assigning ' + data.assigned);
  var field = $('#assigneduser');
  var _url = _issues_url + '?assignee=' + data.assigned.name + '">' + data.assigned.name + '</a>';
  field.html(_url);
  field = $('#assignee');
  field.val(data.assigned.name);
}

unassigne_issue = function(data) {
  console.log('un-assigning ');
  var field = $('#assigneduser');
  field.html(' ');
  field = $('#assignee');
  field.val('');
}

add_deps = function(data, issue_uid, _issue_url) {
  console.log('adding ' + data.added_dependency);
  if (data.issue_uid == issue_uid){
    if (data.type == "children"){
      var field = $('#blockers');
      var field2 = $('#blocks');
    } else {
      var field = $('#dependencies');
      var field2 = $('#depends');
    }
  }
  var dep = data.added_dependency;
  var _data = $.trim(field.html());
  var _url = _issue_url.replace('/-1', '/' + dep) + dep + '</a>';
  _data += ',' + _url;
  field.html(_data);
  var _curval = field2.val();
  if (_curval && _curval != ',') {
    _curval += ',';
  }
  field2.val(_curval + dep);
}

remove_deps = function(data, issue_uid, _issue_url) {
  console.log('Removing ' + data.removed_dependency);
  if (data.issue_uid == issue_uid){
    if (data.type == "children"){
      var field = $('#dependencies');
      var field2 = $('#depends');
    } else {
      var field = $('#blockers');
      var field2 = $('#blocks');
    }
  }
  var dep = data.removed_dependency;
  // Set links
  var _data = $.trim(field.html()).split(',');
  var _url = _issue_url.replace('/-1', '/' + dep) + dep + '</a>';
  field.html(clean_entry(field.html(), _url).join());
  // Set the value in the input field
  field2.val(clean_entry(field2.val(), dep).join());
}

add_comment = function(data) {
  console.log('Adding comment ' + data.comment_added);
  var field = $('#comments');
  var _data = '<section class="issue_comment"> \
    <header id="comment-' + data.comment_id + '"> \
      <img class="avatar circle" src="' + data.avatar_url + '"/> \
      <a href="/user/' + data.comment_user + '"> \
        ' + data.comment_user + '\
      </a> - <span title="' + data.comment_date + '">seconds ago</span> \
      <a class="headerlink" title="Permalink to this headline" \
        href="#comment-' + data.comment_id + '">¶</a> \
      <aside class="issue_action icon"> \
        <a class="reply" title="Reply to this comment - loose formating"> \
          reply \
        </a> \
      </aside> \
    </header> \
    <div class="comment_body"> \
      <p>' + data.comment_added + '</p> \
    </div> \
  </section>';
  field.html(field.html() + _data);
}

update_issue = function(data) {
  console.log('Adjusting issue ' + data.fields);
  for (i=0; i<data.fields.length; i++){
    var _f = data.fields[i];
    if (_f == 'status') {
      var field = $('#status');
      field.val(data.issue.status);
    } else if (_f == 'title'){
      var field = $('#issuetitle');
      field.html(data.issue.title);
    } else if (_f == 'content'){
      var field = $('#comment-0').parent().find('.comment_body');
      field.html('<p>' + data.issue.content + '</p>');
    }
  }
}

process_event = function(data, issue_uid, _issue_url, _issues_url){
  console.log(data);
  if (data.added_tags){
    add_tags(data, _issues_url);
  }
  else if (data.removed_tags){
    remove_tags(data, _issues_url);
  }
  else if (data.assigned){
    assigne_issue(data, _issues_url);
  }
  else if (data.unassigned){
    unassigne_issue(data);
  }
  else if (data.added_dependency){
    add_deps(data, issue_uid, _issue_url);
  }
  else if (data.removed_dependency){
    remove_deps(data, issue_uid, _issue_url);
  }
  else if (data.comment_added){
    add_comment(data);
  }
  else if (data.fields){
    update_issue(data);
  }
}
