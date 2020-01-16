/* tslint:disable:variable-name */
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private CATEGORIES: {name: string}[] = [
    {name: 'Languages'}, {name: 'Mathematics'}, {name: 'English'}, {name: 'History'}, {name: 'Science'},
    {name: 'Philosophy'}, {name: 'Nursing'}, {name: 'Computer Science'}, {name: 'American Studies'},
    {name: 'Art & Design'}, {name: 'Chemistry'}, {name: 'Civil Engineering'}, {name: 'Economics'},
    {name: 'Education'}, {name: 'Film Making'}, {name: 'Geology'}, {name: 'Marketing'}, {name: 'Music'}, {name: 'Sociology'},
  ];

  constructor(private http: HttpClient) {
  }

  getCourseInfo(course) {
    const params = {params: new HttpParams().set('key', `${course}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-info`, params);
  }

  // tslint:disable-next-line:variable-name
  getDiscussions(course_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussions`, params);
  }

  getAnnouncements(course_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-announcements`, params);
  }

  // tslint:disable-next-line:variable-name
  getModules(course_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/modules`, params);
  }

  // tslint:disable-next-line:variable-name
  getDiscussionPosts(course_id, discussion_id, startFrom) {
    const params = {params: new HttpParams().set('course', `${course_id}`)
        .set('discussion', `${discussion_id}`).set('start', `${startFrom}`)};
    return this.http.get(`${environment.apiAddress}/courses/discussion-posts-from`, params);
  }

  // tslint:disable-next-line:variable-name
  getAllDiscussionPosts(course_id, discussion_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`)
        .set('discussion', `${discussion_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/discussion-posts`, params);
  }

  // tslint:disable-next-line:variable-name
  getDiscussionInfo(course_id, discussion_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`).set('discussion', `${discussion_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussion-info`, params);
  }

  getConversationInfo(course_id, conversation_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`).set('discussion', `${conversation_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-discussion-info`, params);
  }

  // tslint:disable-next-line:variable-name
  getPage(course_id, module_id, page_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`)
        .set('module', `${module_id}`).set('page', `${page_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/page`, params);
  }

  getStudentCourseGrades(course_id, student_id) {
    const params = {params: new HttpParams().set('course', `${course_id}`).set('student', `${student_id}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-grades`, params);
  }

  // tslint:disable-next-line:variable-name
  getInstructorInfo(instructor_id) {
    const params = {params: new HttpParams().set('id', `${instructor_id}`)};
    return this.http.get(`${environment.apiAddress}/users/instructor-info`, params);
  }

  getAllInstructors() {
    return this.http.get(`${environment.apiAddress}/users/all-instructors`);
  }

  getAllCategories() {
    return this.CATEGORIES;
  }

  // tslint:disable-next-line:variable-name
  postDiscussionPost(course_id, discussion_id, post) {
    return this.http.post(`${environment.apiAddress}/courses/add-discussion-post`, {
      course: course_id,
      discussion: discussion_id,
      post
    });
  }

  sendMessage(course_id, discussion_id, conversation) {
    return this.http.post(`${environment.apiAddress}/courses/add-conversation-message`, {
      course: course_id,
      discussion: discussion_id,
      conversation
    });
  }
  updateCourse(course) {
    return this.http.post(`${environment.apiAddress}/courses/update-course`, {course});
  }

  newDiscussion(course, discussion) {
    discussion.public = true;
    return this.http.post(`${environment.apiAddress}/courses/add-course-discussion`, {course, discussion});
  }

  getConversations() {
    return this.http.get(`${environment.apiAddress}/courses/course-conversations`);
  }

  newConversation(course, discussion) {
    discussion.public = false;
    discussion.isClosed = false;
    discussion.endDate = new Date('2099-01-01');
    return this.http.post(`${environment.apiAddress}/courses/add-course-conversation`, {course, discussion});
  }

  newAnnouncement(course, announcement) {
    return this.http.post(`${environment.apiAddress}/courses/add-course-announcement`, {course, announcement});
  }

  addCourse(course) {
    return this.http.post(`${environment.apiAddress}/courses/add-course`, {course});
  }

  // tslint:disable-next-line:variable-name
  newContentPush(course, module_id, content) {
    return this.http.post(`${environment.apiAddress}/courses/add-module-content`, {course, module: module_id, content});
  }

  newQuizPush(course, module_id, quiz) {
    return this.http.post(`${environment.apiAddress}/courses/add-module-quiz`, {
      course,
      module: module_id,
      content: quiz
    });
  }

  newModule(course, newModule) {
    return this.http.post(`${environment.apiAddress}/courses/add-module`, {course, module: newModule});
  }

  removeContent(course, module_id, content) {
    return this.http.post(`${environment.apiAddress}/courses/remove-content`, {
      course,
      module: module_id,
      content
    });
  }

  getCourseModule(course, module_id) {
    const params = {params: new HttpParams().set('course', `${course}`).set('module', module_id)};
    return this.http.get(`${environment.apiAddress}/courses/course-module`, params);
  }

  updateDiscussion(course, discussion) {
    return this.http.post(`${environment.apiAddress}/courses/update-discussion`, {
      course,
      discussion
    });
  }

  deleteDiscussion(course, discussion) {
    return this.http.post(`${environment.apiAddress}/courses/remove-discussion`, {
      course,
      discussion
    });
  }

  getRegistered(course) {
    const params = { params: new HttpParams().set('course', `${course}`)};
    return this.http.get(`${environment.apiAddress}/courses/registered-students`, params);
  }

  getStudents(course) {
    const params = { params: new HttpParams().set('course', `${course}`)};
    return this.http.get(`${environment.apiAddress}/courses/course-students`, params);
  }

  getWaitlistSize(course) {
    const params = {params: new HttpParams().set('course', `${course}`)};
    return this.http.get(`${environment.apiAddress}/courses/waiting-list-size`, params);
  }

  removeRegistree(student, course) {
    return this.http.post(`${environment.apiAddress}/courses/remove-registree`, {student, course});
  }

  removeStudent(student, course) {
    return this.http.post(`${environment.apiAddress}/courses/remove-student-from-course`, {student, course});
  }

  confirmEnrollmet(student, course) {
    return this.http.post(`${environment.apiAddress}/courses/confirm-enrollment`, {student, course});
  }

  getStudentCourses() {
    return this.http.get(`${environment.apiAddress}/courses/student-courses`);
  }

  getQuiz(course, moduleID, quiz) {
    const params = {params: new HttpParams().set('course', `${course}`).set('module', `${moduleID}`).set('quiz', `${quiz}`)};
    return this.http.get(`${environment.apiAddress}/courses/module-quiz`, params);
  }

  getServerTime() {
    return this.http.get(`${environment.apiAddress}/utils/date`);
  }

  setQuizStartTime(student, course, quiz)  {
    return this.http.post(`${environment.apiAddress}/courses/set-start-time`, {student, course, quiz});
  }

  submitQuiz(student, course, module, quiz, responses) {
    return this.http.post(`${environment.apiAddress}/courses/submit-quiz`, {student, course, module, quiz, responses});
  }

  getStudentQuizRecord(student, course, quiz) {
    const params = {params: new HttpParams().set('student', `${student}`).set('course', `${course}`).set('quiz', `${quiz}`)};
    return this.http.get(`${environment.apiAddress}/courses/student-record`, params);
  }

  getQuizInfo(course, moduleID, quiz) {
    const params = {params: new HttpParams().set('course', `${course}`).set('module', `${moduleID}`).set('quiz', `${quiz}`)};
    return this.http.get(`${environment.apiAddress}/courses/quiz-info`, params);
  }

  saveResponses(student, course, quiz, responses) {
    return this.http.post(`${environment.apiAddress}/courses/save-responses`, {student, course, quiz, responses});
  }

  getCoursesSortBy(sort, start, open) {
    const params = {params: new HttpParams().set('sort', sort).set('start', start).set('open', `${open}`)};
    return this.http.get(`${environment.apiAddress}/courses/courses-by`, params);
  }

  getCoursesCatergorySortBy(category, sort, start, open) {
    const params = {params: new HttpParams().set('category', `${category}`)
        .set('sort', `${sort}`).set('start', `${start}`).set('open', `${open}`)};
    return this.http.get(`${environment.apiAddress}/courses/courses-cat-by`, params);
  }

  getAdminCourses() {
    return this.http.get(`${environment.apiAddress}/courses/admin-courses`);
  }

  tryEnroll(student, course) {
    return this.http.post(`${environment.apiAddress}/courses/signup`, {student, course});
  }

  canRegister(student, course) {
    const params = {params: new HttpParams().set('student', `${student}`).set('course', `${course}`)};
    return this.http.get(`${environment.apiAddress}/courses/can-register`, params);
  }

  removeModule(course, moduleId) {
    return this.http.post(`${environment.apiAddress}/courses/remove-module`, {course, moduleId});
  }

  removeCourse(courseId) {
    return this.http.post(`${environment.apiAddress}/courses/remove-course`, {"courseId" : courseId});
  }

  getPredictions(text) {
    const params = {params: new HttpParams().set('text', `${text}`)};
    return this.http.get(`${environment.apiAddress}/courses/predict`, params)
  }

  getSearchPage(text, start) {
    const params = {params: new HttpParams().set('text', `${text}`).set('start', `${start}`)};
    return this.http.get(`${environment.apiAddress}/courses/search-page`, params)
  }
}
