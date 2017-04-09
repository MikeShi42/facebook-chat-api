"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
  return function createEvent(
          name,
          description,
          startDate, startTime, endDate, endTime,
          loc, groupId, timezone, inviteGroupMembers, guestListEnabled,
          guestsCanInviteFriends, onlyAdminsCanPost, postApprovalRequired,
          callback) {

    const requestURL = 'https://www.facebook.com/ajax/create/event/submit/';

    defaultFuncs
      .postQs(requestURL, ctx.jar, {
          title: name,
          description: description,
          location: loc.name,
          location_id: loc.id,
          group_id: groupId,
          'cover_focus[x]':0.5,
          'cover_focus[y]':0.5,
          only_admins_can_post: onlyAdminsCanPost,
          post_approval_required: postApprovalRequired,
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,  // Seconds since 12AM
          timezone: timezone, // 'America/Los_Angeles'
          guests_can_invite_friends: guestsCanInviteFriends,
          guest_list_enabled: guestListEnabled,
          save_as_draft: false,
          invite_group_members: inviteGroupMembers,
          is_multi_instance: false,
          dpr: 1,
      })
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function(resData) {
        console.log(resData);
        callback(resData);

        if (resData.error) {
          throw resData;
        }
      })
      .catch(function(err) {
        log.error("createEvent", err);
        return callback(err);
      });
  };
};
