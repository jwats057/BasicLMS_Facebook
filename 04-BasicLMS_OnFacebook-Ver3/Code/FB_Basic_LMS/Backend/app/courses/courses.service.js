const database = require('firebase-admin').database();
const userService = require('../users/users.service');

const MAX_POSTS = 50;

class CoursesService {
    constructor() {}

    /**
     *
     * @param {name: string, description: string, indtructor_id: ,max_size: number, isOpen: boolean} newCourse
     *
     * @return true if successfully added
     */
    async addCourse(newCourse) {
        try {
            let course = await database.ref('/courses').once('value');
            course.ref.push(
                {
                    name: newCourse.name,
                    description: newCourse.description,
                    instructor_id: newCourse.instructor_id,
                    modules: [],
                    assignments: [],
                    size: 0,
                    discussions: [],
                    MAX_SIZE: newCourse.MAX_SIZE,
                    isOpen: newCourse.isOpen,
                    endEnrollDate: newCourse.endEnrollDate,
                    category: newCourse.category,
                }
            );
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course_key
     * @param {title: string, description: string, isClosed: boolean} newDiscussion
     *
     * @return true if successfully added new discussion
     */
    async addDiscussion(course_key, newDiscussion) {
        try {
            let courses = await database.ref('/courses')
            .orderByKey()
            .equalTo(course_key)
            .once('value');
            if(courses.numChildren() > 1) {
                return false;
            }
            courses.forEach((course) => {
                // for await (let course of courses) {
                let key = course.child('discussions').ref.push({
                    title: newDiscussion.title,
                    description: newDiscussion.description,
                    isClosed: newDiscussion.isClosed,
                    endDate: newDiscussion.endDate,
                    public: newDiscussion.public
                }).key;
                if (newDiscussion.public === false) {
                    console.log(key);
                    let receivers = {};
                    newDiscussion.recipients.forEach((user_id) => {
                        receivers[user_id] = {
                            read: false
                        }
                    });
                    database.ref('/conversations/')
                        .child(key)
                        .update({
                                creator: newDiscussion.user_id,
                                lastmessagedate: Date.now(),
                                lastmessageusername: newDiscussion.user_name,
                                recipients: receivers,
                                course_name: newDiscussion.course_name
                        })
                }
            })
        } catch(err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course_key
     * @param {title: string, description: string, isClosed: boolean} newAnnouncement
     *
     * @return true if successfully added new discussion
     */
    async addAnnouncement(course_key, newAnnouncement) {
        try {
            let courses = await database.ref('/courses')
                .orderByKey()
                .equalTo(course_key)
                .once('value');
            if(courses.numChildren() > 1) {
                return false;
            }
            courses.forEach((course) => {
                course.child('announcements').ref.push({
                    title: newAnnouncement.title,
                    description: newAnnouncement.description,
                    instructor_name: newAnnouncement.instructor_name,
                    date: newAnnouncement.date,
                });
            });
        } catch(err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course, course key in database
     * @param {string} discussion, discussion key in database
     * @param {user_name: string, user_id: string, date: string, post: string} post
     *
     * @return true if post is successfully added
     */
    async addDiscussionPost(course, discussion, post) {
        try {
            await database.ref('/courses/' + course + '/discussions/')
                .child(discussion).child('posts').push(
                    {
                        user_name: post.user_name,
                        user_id: post.user_id,
                        date: post.date,
                        post: post.post
                    }
                )
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     * @param {string} course, course key in database
     * @param {string} discussion, discussion key in database
     * @param {user_name: string, user_id: string, date: string, post: string} post
     * @return true if post is successfully added
     */
    async addConversationMessage(course, discussion, message) {
        try {
            await database.ref('/courses/' + course + '/discussions/')
                .child(discussion).child('posts').push(
                    {
                        user_name: message.user_name,
                        user_id: message.user_id,
                        date: message.date,
                        post: message.message
                    }
                );
            await database.ref('/conversations/')
                .child(discussion).update({
                    lastmessagedate: message.date,
                    lastmessageusername: message.user_name,
                    });
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course, course key in the database
     * @param {name: string} module_obj
     *
     * @return true if successfully added module to course
     */
    async addCourseModule(course, module_obj) {
        try {
            let courses = await database.ref('/courses').orderByKey().equalTo(course).once('value');
            if(courses.numChildren() != 1) {
                throw false;
            }
            courses.child(course).child('modules').ref.push({
                name: module_obj.name
            });
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course_key , course key in the database
     * @param {string} module_key , module key in the database
     * @param {title: string, isTimed: boolean, time: number, dueDate: string, attempts: number,
     * items: {cal,: number, question: string, answer: string, options: string[]}[]} content
     *
     * @return true if successfully added quiz
     */
    async addModuleQuiz(course_key, module_key, content) {

        try {
            let courses = await database.ref('/courses/' +  course_key).once('value');
            if(courses.hasChildren) {
                let items = courses.child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    time: content.time,
                    dueDate: content.dueDate,
                    attempts: content.attempts,
                    attempted: 0,
                    outOf: 0,
                    startTime: "null",
                    score: 0,
                    coins: content.coins,
                });
                let total = 0;
                content.items.forEach( (item) => {
                    total += item.value;
                    items.child('items').ref.push({
                        value: Number(item.value),
                        question: item.question,
                        answer: item.answer,
                        options: item.options,
                        response: '-1',
                    });
                });
                await items.update({outOf: total});
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course_key , course key in the database
     * @param {string} module_key , module key in the database
     * @param {title: string, url: string} content
     *
     * @return true if successfully added Url link to module
     */
    async addModuleUrl(course_key, module_key, content) {
        try {
            let courses = await database.ref('/courses').orderByKey().equalTo(course_key).once('value');
            if(courses.hasChildren) {
                courses.child(course_key).child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    url: content.url
                });
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} course_key , course key in the database
     * @param {string} module_key , module key in the database
     * @param {title: string, link: string} content
     *
     * @return true if successfully added link to module
     */
    async addModuleLink(course_key, module_key, content) {
        try {
            let courses = await database.ref('/courses').orderByKey().equalTo(course_key).once('value');
            if(courses.hasChildren) {
                courses.child(course_key).child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    link: content.link,
                });
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async addModuleContent(course_key, module_key, content) {
        try {
            let courses = await database.ref('/courses').orderByKey().equalTo(course_key).once('value');
            if(courses.hasChildren) {
                courses.child(course_key).child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    link: content.link || null,
                    url: content.url || null,
                    embedded: content.embedded || null,
                    page: content.page || null,
                });
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     * @return {
     * {id: string, name: string, isOpen: boolean, description: string,
     * instructor_id: string, size: number, MAX_SIZE: number}[]
     * } courses
     */
    async getAllCourses(key) {
        let payload = [];
        let courses = await database.ref('/courses').orderByKey().equalTo(key).once('value');
        courses.forEach( (course) => {
            payload.push({
                id: course.key,
                name: course.child('name').val(),
                isOpen: course.child('isOpen').val(),
                description: course.child('description').val(),
                instructor_id: course.child('instructor_id').val(),
                size: course.child('size').val(),
                MAX_SIZE: course.child('MAX_SIZE').val()
            });
        });
        return payload;
    }

    /**
     *
     * @param {string} course_id , course key in the database
     *
     * @return {{id: string, title: string, dueDate: string, outOf: number}[]} assessments
     */
    async getAssessmentsList(course_id) {
        let assessments = [];
        try {
            let courseModules = await database.ref('/courses/' + course_id + '/modules').once('value');
            courseModules.forEach( (mod) => {
                mod.child("content").forEach( (cont) => {
                    if(cont.hasChild('outOf')) {

                        const assessment = cont.toJSON();
                        assessments.push({
                            id: cont.key,
                            title: assessment.title,
                            dueDate: assessment.dueDate,
                            outOf: assessment.outOf,
                        });
                    }
                })
            });
        } catch(err) {
            console.error(err);
        }
        return assessments;
    }

    /**
     *
     * @param {string} key , course key in the database
     *
     * @return {id: string, name: string, description: string, instructor: string, size: number, MAX_SIZE: number} course_info
     */
    async getCourseInfo(key) {
        let myCourse = {};
        let courses = await database.ref('/courses').orderByKey().equalTo(key).once('value');
        courses.forEach( (member) => {
            let course = member.toJSON();
            myCourse = {
                id: member.key,
                name: course.name,
                description: course.description,
                instructor: course.instructor_id,
                size: course.size,
                MAX_SIZE: course.MAX_SIZE,
                endEnrollDate: course.endEnrollDate,
            };
        });
        return myCourse;
    }

    /**
     *
     * @param {string} courses_id , course key in the database
     *
     * @returns {name: string,
     *           resources: {id: string, title: string, url: string, link: string, isTime}[]}[]
     */
    async getCourseModules(courses_id) {
        let payload = {
            modules: []
        };
        let tempModule;
        try {
            let courseModules = await database.ref('/courses/' + courses_id + '/modules').once('value');
            courseModules.forEach( (mod) => {
                tempModule = {id:'', name: '', resources: []};
                tempModule.name = mod.child('name').val();
                tempModule.id = mod.key;
                mod.child('content').forEach( (item) => {
                    tempModule.resources.push({
                    id: item.key,
                    mod: mod.key,
                    title: item.child('title').val(),
                    url: item.child('url').val(),
                    link: item.child('link').val(),
                    outOf: item.child('outOf').val(),
                    embedded: item.child('embedded').val(),
                    page: item.child('page').val(),
                    });
                });
                   payload.modules.push(tempModule);
            });
        } catch (err) {
               console.error(err);
        }
           return payload.modules;
    }

    /**
     *
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     *
     * @return {title: string, description: string, isClosed: boolean} discussion_info
     */
    async getDiscussionInfo(course, discussion_id) {
        try {
            let discussion = await database.ref('/courses/' + course + '/discussions/' + discussion_id).once('value');
            return {
                title: discussion.child("title").val(),
                description: discussion.child("description").val(),
                isClosed: discussion.child("isClosed").val(),
                endDate: discussion.child("endDate").val()
            };
        }catch (err) {
            console.error(err);
        }
        return {title: "", description: "", isClosed: true};
    }

    /**
     *
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     *
     * @return {{id: string, date: string, post: string, user_id: string, user_name: string}[]} posts
     */
    async getDiscussionPosts(course, discussion) {
        let payload = {
            posts: []
        };
        try {
            let posts = await database.ref('/courses/' + course + '/discussions/' + discussion + '/posts/')
                .orderByChild('date').once('value');
            if(!posts.hasChildren()) {
                return payload;
            }
            posts.forEach( (item) => {
                let post = item.toJSON();
                post.id = item.key;
                payload.posts.push(post);
            });
        }catch (err) {
            console.error(err);
        }
        return payload.posts;
    }

    /**
     *
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     * @param {number} start , element "index" from which to begin fetching post
     *
     * @return {{id: string, date: string, post: string, user_id: string, user_name: string}[]} posts
     */
    async getDiscussionPostsFrom(course, discussion, start) {
        let payload = {
            posts: [],
            total: 0,
        };
        let loadedPosts = 0;
        try {
            payload.total = await this.getNumberOfPosts(course, discussion);
            if(payload.total < 1) throw 'not error, the discussion is empty';
            let posts = await database.ref('/courses/' + course + '/discussions/' + discussion + '/posts/')
            .orderByKey()
            .limitToLast(payload.total - start)
            .once('value');
            if(!posts.hasChildren()) {
                return payload;
            }
            posts.forEach( (item) => {
                if(loadedPosts < MAX_POSTS) {
                    let post = item.toJSON();
                    post.id = item.key;
                    payload.posts.push(post);
                } else {
                    throw "Not error, just interrupt for each with a throw";
                }
                loadedPosts++;
            });
        }catch (err) {
            console.error(err);
        }
        return payload;
    }

    /**
     *
     * @param {string} course_key , course key in the database
     *
     * @return {{title: string, id: string}[]} discussions
     */
    async getDiscussions(course_key, isPublic) {
        let payload = {
            discussions: []
        };
        try {
            let discussions = await database.ref('/courses/' + course_key + '/discussions')
            .once('value');
            discussions.forEach( (discussion) => {
                if(discussion.child('public').val() === isPublic) {
                    payload.discussions.push({
                        id: discussion.key,
                        courseId: course_key,
                        title: discussion.child('title').val(),
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
        return payload.discussions;
    }

    /**
     *
     * @param {string} course_key , course key in the database
     *
     * @return {{title: string, id: string}[]} discussions
     */
    async getAnnouncements(course_key) {
        let payload = {
            announcements: []
        };
        try {
            let announcements = await database.ref('/courses/' + course_key + '/announcements')
                .once('value');
            announcements.forEach( (announcement) => {
                payload.announcements.push({
                    id: announcement.key,
                    title: announcement.child('title').val(),
                    date: announcement.child('date').val(),
                    instructor: announcement.child('instructor_name').val(),
                    description: announcement.child('description').val()
                });
            });
        } catch (err) {
            console.error(err);
        }
        return payload.announcements;
    }

    async getConversations(user, isAdmin) {
        let payload = {
            discussions: []
        };
        try {
            let courses = [];
            let user_id = '';
            if(!isAdmin) {
                courses = await this.getMyCourses(user);
                user_id = user;
            } else {
                courses = await this.getAdminCourses(user);
                user_id = user.id
            }
            console.log(user_id);
            for await (let course of courses) {
                let myDiscussions = [];
                let discussions = await this.getDiscussions(course.id, false);
                for await (let discussion of discussions) {
                    let conversation = await database.ref('/conversations/').child(discussion.id).once('value');
                    if (conversation.child('recipients').hasChild(user_id) || conversation.child('creator').val() === user_id) {
                        discussion.lastmessageusername = conversation.child('lastmessageusername').val();
                        discussion.lastmessagedate = conversation.child('lastmessagedate').val();
                        discussion.course_name = conversation.child('course_name').val();
                        myDiscussions.push(discussion);
                    }
                }
                payload.discussions = payload.discussions.concat(myDiscussions);
            }
        } catch (err) {
            console.error(err);
        }
        console.log('Payload ' + JSON.stringify(payload.discussions));
        console.log('####################### DONE DISCUSSION POST #############################');
        return payload.discussions;
    }

    /**
     *
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     *
     * @param {number}, number of posts in a discussion
     */
    async getNumberOfPosts(course, discussion) {
        try {
            let posts = await database.ref('/courses/' + course + '/discussions/' + discussion + '/posts/').once('value');
            return posts.numChildren();
        } catch (err) {
            console.error(err);
        }
        return 0;
    }

    /**
     *
     * @param {string} user, student key in the database
     *
     * @return {{id: string, name: string}[]} courses
     */
    async getMyCourses(user) {
        console.log('########### getMyCourses(user) LOGGING user:   ', user);
        let payload = {
            courses: []
        };
        try {
            let student = await database.ref('/students/' + user + '/enrolled').once('value');
            student.forEach( (item) => {
                payload.courses.push({id: item.child('id').toJSON()});
            })
            let courses = await database.ref('/courses').once('value');
            for(var i =0; i < payload.courses.length; i++){
                payload.courses[i].name = (courses.child(payload.courses[i].id).child('name').val());
            }
        } catch (err) {
            console.error(err);
        }
        return payload.courses;
    }

    async getPage(course_id, module_id, page_id){
        let payload = {};
        try {
            let page = await database.ref('/courses/' + course_id + '/modules/' + module_id + '/content/' + page_id).once('value');
            return page.toJSON();
        } catch(err) {
            console.error(err);
        }
        return payload;
    }

    /**
     *
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     *
     * @return {{{id: string, title: string, dueDate: string, outOf: number, doneOn: string, score: number}[]}} records
     */
    async getStudentGrades(course_id, student_id) {
        let assessments = await this.getAssessmentsList(course_id);
        let records = [];
        if(assessments.length < 1) return assessments;
        try {
            for(let i = 0; i < assessments.length; i++) {
                let rec = await this.getStudentRecord(student_id, course_id, assessments[i].id);
                records.push({
                    id: assessments[i].id,
                    title: assessments[i].title,
                    dueDate: assessments[i].dueDate,
                    outOf: assessments[i].outOf,
                    doneOn: rec.doneOn,
                    score: rec.score,
                    startTime: rec.startTime,
                });
            }
        } catch(err) {
            console.error(err);
        }
        return records;
    }

    /**
     *
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     * @param {string} assessment_id, assesment key in the database
     *
     * @return {doneOn: string, score: number} record

     */
    async getStudentRecord(student_id, course_id, assessment_id) {
        let payload = {
            title: '',
            attempted: 0,
            doneOn: null,
            dueDate: null,
            outOf: 100,
            score: 0,
            startTime: null,
            items: []
        };
        try {
            let records = await database.ref('/students/' + student_id + '/enrolled/' + course_id)
            .once('value');
            let record = records.child('records').child(assessment_id).toJSON();
            if(record != null) {
                payload = {
                    title: record.title,
                    attempted: record.attempted || 0,
                    doneOn: record.doneOn,
                    dueDate: record.doneDate,
                    outOf: record.outOf,
                    score: record.score,
                    startTime: record.startTime,
                    items: record.items
                }
            }
        } catch(err) {
            console.error(err);
        }
        return payload;
    }

    async removeModule(course, moduleId) {
        try {
            await database.ref('/courses/' + course + '/modules/' + moduleId).remove();
        } catch(err) {
            return false;
        }
        return true;
    }
    async getQuiz(course, module_key, quiz) {
        let payload = {attempted: 0,
            attempts: 'unlimited',
            dueDate: 'null',
            items: [],
            outOf: 0,
            score: 0,
            startTime: 'null',
            time: -1,
            title: 'null',};
        try {
            let quizzes = await database.ref('/courses/' + course + '/modules/' + module_key + '/content/' + quiz)
                .once('value');
            let record = await quizzes.toJSON();
            payload = {
                attempted: record.attempted || 0,
                attempts: record.attempts || 'unlimited',
                dueDate: record.dueDate,
                items: [],
                outOf: record.outOf,
                score: record.score,
                startTime: record.startTime,
                time: record.time || -1,
                title: record.title || null,
            };
            quizzes = await quizzes.ref.child('items').once('value');
            quizzes.forEach( (item) => {
                record = item.toJSON();
                let _item = {
                    options: Object.keys(record.options).map( function(key) {
                        return record.options[key];
                    }),
                    question: record.question,
                    response: record.response,
                    value: record.value,
                };
                payload.items.push(_item);
            });
        } catch (err) {
            console.error(err);
        }
        return payload;
    }

    async getQuizInfo(course, module_key, quiz) {
        let payload = {attempted: 0,
            attempts: 'unlimited',
            dueDate: 'null',
            items: [],
            outOf: 0,
            score: 0,
            startTime: 'null',
            time: -1,
            title: 'null',};
            try {
                let quizzes = await database.ref('/courses/' + course + '/modules/' + module_key + '/content/' + quiz).once('value');
                let record = await quizzes.toJSON();
                payload = {
                    attempted: record.attempted || 0,
                    attempts: record.attempts || -1,
                    dueDate: record.dueDate,
                    items: [],
                    outOf: record.outOf,
                    score: record.score,
                    startTime: record.startTime,
                    time: record.time || -1,
                    title: record.title || null,
                };
            } catch (err) {
                console.error(err);
            }
            return payload;
    }

    async getQuizFull(course, module_key, quiz) {
        let payload = {
            attempted: 0,
            attempts: 'unlimited',
            dueDate: 'null',
            items: [],
            outOf: 0,
            score: 0,
            startTime: 'null',
            time: -1,
            title: 'null',
            coins: 0,
        };
        try {
            let quizzes = await database.ref('/courses/' + course + '/modules/' + module_key + '/content/' + quiz)
                .once('value');
            let record = await quizzes.toJSON();
            payload = {
                attempted: record.attempted,
                attempts: record.attempts || -1,
                dueDate: record.dueDate,
                items: [],
                outOf: record.outOf,
                score: record.score,
                startTime: record.startTime,
                time: record.time || -1,
                title: record.title || null,
                coins: record.coins || 0,
            };
            quizzes = await quizzes.ref.child('items').once('value');
            quizzes.forEach( (item) => {
                record = item.toJSON();
                payload.items.push({
                    answer: record.answer,
                    options: record.options || null,
                    question: record.question || null,
                    response: record.response || null,
                    value: record.value || null,
                });
            });
        } catch (err) {
            console.error(err);
        }
        return payload;
    }

    async removeContent(course, module_id, content) {
        try {
            await database.ref('/courses/' + course + '/modules/' + module_id + '/content/' + content).remove();
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     *
     * @returns {boolean} true if this student is enrolled in this course
     */
    async studentHasCourse(student_id, course_id) {
        console.log(student_id, course_id);
        let student = await database.ref('/courses/' + course_id + '/students').once('value');
        return student.numChildren() > 0 && student.hasChild(student_id);
    }

    async updateCourse(course) {
        try {
            await database.ref('/courses/' + course.id).update({
                name: course.name,
                instructor_id: course.instructor,
                description: course.description,
                endEnrollDate: course.endEnrollDate
            });
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async getModule(course, module_id) {
        let payload = {id: '', title: '', resources: []};
        try {
            let current_module = await database.ref('/courses').child(course)
            .child('modules').child(module_id).once('value');
            payload.title = current_module.child('name').val();
            payload.id = current_module.key;

            current_module.child('content').forEach( (item) => {
                payload.resources.push({
                    id: item.key,
                    mod: current_module.key,
                    title: item.child('title').val(),
                    url: item.child('url').val(),
                    link: item.child('link').val(),
                    outOf: item.child('outOf').val(),
                    embedded: item.child('embedded').val(),
                    page: item.child('page').val(),
                });
            });
        } catch (err) {
            console.error(err);
        }
        return payload;
    }

    async updateDiscussion(course, discussion) {
        try {
            await database.ref('/courses/' + course + '/discussions/' + discussion.id).update({
                description: discussion.description,
                endDate: discussion.endDate,
                isClosed: discussion.isClosed,
                title: discussion.title,
            });
        } catch(err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async removeDiscussion(course, discussion) {
        try {
            await database.ref('/courses/' + course + '/discussions/' + discussion).remove();
        } catch(err) {
            console.error(err);
            return false;
        }
        return true;
    }

    /**
     * @return {string[]} categories
     */
    async getAllCourses() {
        let payload = [];

        let coursesRef = await database.ref('/courses').orderByValue();
        coursesRef.forEach( (course) => {
            payload.push({
                name: course.name,
                id: course.key,
                instructor_name: course.instructor_name
            })
        });
        return payload;
    }

    async signUpFor(user, course) {
        try {
            if( await this.studentHasCourse(user, course)) return false;
            let courseInfo = await this.getCourseInfo(course);
            if(courseInfo.size >= courseInfo.MAX_SIZE) {
                return await this.addToWaitingList(user, course);
            }
            await database.ref('/courses/' + course + '/registered').child(user).set({student_id: user});
            let increment = await database.ref('/courses/' + course).once('value');
            await increment.ref.update({size: (increment.child('size').val() + 1)});
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async addToWaitingList(user, course) {
        try {
            await database.ref('/courses/' + course + '/waiting-list').child(user).set({student_id: user});
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async getRegistered(course) {
        let payload = [];
        let ids = [];
        try {
            let registered = await database.ref('/courses/' + course + '/registered').once('value');
            registered.forEach((item) => {
                ids.push(item.child('student_id').val());
            });
            let index;
            for (index = 0; index < ids.length; index++) {
                let temp = await userService.getStudentDetail(ids[index]);
                temp.id = ids[index];
                payload.push(temp);
            }
        } catch (err) {
            console.error(err);
        }
        return payload;
    }

    async getStudents(course) {
        let payload = [];
        let ids = [];
        try {
            let registered = await database.ref('/courses/' + course + '/students').once('value');
            registered.forEach((item) => {
                ids.push(item.child('id').val());
            });
            let index;
            for (index = 0; index < ids.length; index++) {
                let temp = await userService.getStudentDetail(ids[index]);
                temp.id = ids[index];
                payload.push(temp);
            }
        } catch (err) {
            console.error(err);
        }
        return payload;
    }

    async waitingListSize(course) {
        let size = 0;
        try {
            let waitingList = await database.ref('/courses/' + course + '/waiting-list').once('value');
            size = waitingList.numChildren();
        } catch(err) {
            console.error(err);
        }
        return size;
    }

    async removeRegistree(student, course) {
        try {
            let studentRef = await database.ref('/courses/' + course + '/registered/' + student).once('value');
            if(studentRef.exists()) {
                await studentRef.ref.remove();
                let decrement = await database.ref('/courses/' + course).once('value');
                await decrement.ref.update({size: (decrement.child('size').val() - 1)});
            } else {
                return false;
            }
            await this.moveFromWaitToRegister(course);
        } catch(err){
            return false;
        }
        return true;
    }

    async removeStudent(student, course) {
        try {
            let studentRef = await database.ref('/courses/' + course + '/students/' + student).once('value');
            if(studentRef.exists()) {
                await studentRef.ref.remove();
                let decrement = await database.ref('/courses/' + course).once('value');
                await decrement.ref.update({size: (decrement.child('size').val() - 1)});
            } else {
                return false;
            }
            await this.moveFromWaitToRegister(course);
        } catch(err){
            return false;
        }
        return true;
    }

    async confirmEnrollment(student, course) {
        try {
            if(await userService.enrollIn(student, course)) {
                let studentRef = await database.ref('/courses/' + course + '/registered/' + student).once('value');
                if(studentRef.exists()) {
                    await studentRef.ref.remove();
                } else {
                    return false;
                }
            } else {
                return false;
            }
            await this.moveFromWaitToRegister(course);
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async moveFromWaitToRegister(course) {
        if( await this.waitingListSize(course) < 1) return false;
        try {
            let waitListRef = await database.ref('/courses/' + course + '/waiting-list').limitToFirst(1).once('value');
            waitListRef.forEach( (student) => {
                database.ref('/courses/' + course + '/registered').child(student.key).set({student_id: student.key});
                student.ref.remove();
            });
            let increment = await database.ref('/courses/' + course).once('value');
            await increment.ref.update({size: (increment.child('size').val() + 1) });
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async getCourseStudent(course) {
        let payload = [];
        let list = [];
        let students = await database.ref('/courses/' + course + '/students').once('value');
        students.forEach( (item) => {
            list.push(item.key);
        });
        let student;
        for(let i = 0; i < list.length; i++) {
            student = await userService.getStudentDetail(list[i]);
            payload.push({
                id: student.id,
                fname: student.fname,
                lname: student.lname
            });
        }
        return payload;
    }

    async setQuizStartTime(student, course, assessment) {
        try {
            await database.ref('/students/' + student + '/enrolled/' + course + '/records/' + assessment)
            .update({
                startTime: new Date(),
            });
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async submitQuizForGrade(student, course, module_id, assesment, responses) {
        let quiz = await this.getQuizFull(course, module_id, assesment);
        let oldRecord = await this.getStudentRecord(student, course, assesment);
        let record = {
            title: quiz.title,
            outOf: quiz.outOf,
            score: 0,
            dueDate: quiz.dueDate || null,
            doneOn: new Date(),
            items: responses,
            attempted: oldRecord.attempted + 1,
        };

        if(oldRecord.attempted < 1 && quiz.coins > 0) {
            await userService.addCoins(student, quiz.coins);
        }

        for(let i = 0; i < quiz.items.length; i++) {
            if(quiz.items[i].answer == record.items[i].response) record.score += quiz.items[i].value;
        }
        try {
            await database.ref('/students/' + student + '/enrolled/' + course + '/records/' + assesment)
            .update(record);
        } catch(err) {
            console.error(err);
        }
        return true;
    }

    async saveResponses(student, course, assesment, responses) {
        try {
            await database.ref('/students/' + student + '/enrolled/' + course + '/records/' + assesment)
            .update({items: responses});
        } catch(err) {
            console.error(err);
            return false;
        }
        return true;
    }

    async getCoursesPageByCategory(category, sortby, start, open) {
        sortby = sortby == 'name' ? 'title' : sortby;
        let whole_category = [];
        let page = [];
        let counter = 0;

        
        
        try {
            let ref = await database.ref('/courses').orderByChild('category').equalTo(category).once('value');

            if(open == 'true') {

                ref.forEach( (member) => {
                    var course = member.toJSON();

                    if(course.isOpen == true){
                        whole_category.push({
                            id: member.key,
                            title: course.name,
                            description: course.description,
                            instructor: course.instructor_id,
                            size: course.size,
                            MAX_SIZE: course.MAX_SIZE,
                            endEnrollDate: course.endEnrollDate,
                            category: course.category,
                            isOpen: course.isOpen,
                        });
                    }
                    
                });

            } else {

                ref.forEach( (member) => {
                    var course = member.toJSON();
                    whole_category.push({
                        id: member.key,
                        title: course.name,
                        description: course.description,
                        instructor: course.instructor_id,
                        size: course.size,
                        MAX_SIZE: course.MAX_SIZE,
                        endEnrollDate: course.endEnrollDate,
                        category: course.category,
                        isOpen: course.isOpen,
                    });
                });
            }
            

            whole_category.sort((x, y) => ((x[sortby] === y[sortby]) ? 0 : ((x[sortby] > y[sortby]) ? 1 : -1)));

            let index = 0;
            for(index = start;  (index < 10 && index < whole_category.length); index++) {
                page.push(whole_category[index]);
                counter++;
            }

            for(let i = 0; i < page.length; i++) {
                page[i].instructor = (await userService.getInstructor(page[i].instructor)).name;
            }

        } catch (err) {
            console.error(err);
        }

        return {
            courses: page,
            size: counter,
        };
    }

    async getCoursesPage(sortBy, start, open) {

        let page = [];
        let counter = 0;
        let size = 0;
        try {
            let coursesRef = await database.ref('/courses').once('value');
            size = coursesRef.numChildren();
            coursesRef =  await database.ref('/courses').orderByChild(sortBy).limitToLast(size - start).once('value');
            
            if(open == 'true') {

                coursesRef.forEach( (member) => {
                    if(counter >= 10) throw 'payload full';
                    let course = member.toJSON();
                    if(course.isOpen == true) {

                        page.push({
                            id: member.key,
                            title: course.name,
                            description: course.description,
                            instructor: course.instructor_id,
                            size: course.size,
                            MAX_SIZE: course.MAX_SIZE,
                            endEnrollDate: course.endEnrollDate,
                            category: course.category,
                            isOpen: course.isOpen,
                        });
                        counter++;    
                    }
                });
            } else {
                
                coursesRef.forEach( (member) => {
                    if(counter >= 10) throw 'payload full';
                    let course = member.toJSON();
                    page.push({
                        id: member.key,
                        title: course.name,
                        description: course.description,
                        instructor: course.instructor_id,
                        size: course.size,
                        MAX_SIZE: course.MAX_SIZE,
                        endEnrollDate: course.endEnrollDate,
                        category: course.category,
                        isOpen: course.isOpen,
                    });
                    counter++;
                });
            }
            
        } catch(err) {
            console.error(err);
        }
        for(let i = 0; i < page.length - 1; i++) {
            page[i].instructor = (userService.getInstructor(page[i].instructor)).name;
        }
        page[page.length - 1].instructor =
            (await userService.getInstructor(page[page.length - 1].instructor)).name;
        return {
            courses: page,
            size: size,
        };
    }

    async searchPrediction(text) {
        console.log('start at:', text);
        console.log('end at:', text + "\uf8ff");
        let payload = [];
        try {
            let searchRef = await database.ref('/courses')
            .orderByChild('name')
            .startAt(text)
            .endAt(text + "\uf8ff")
            .once('value');
            searchRef.forEach(course => {
                payload.push(
                    course.child('name').val(),
                );
            });
        } catch (err) {
            console.error(err);
        }
        return payload;
    }

    async getSearchPage(text, start) {
        let page = [];
        let counter = 0;
        let size = 0;
        try {
            let searchRef = await database.ref('/courses')
            .orderByChild('name')
            .startAt(text)
            .endAt(text + "\uf8ff")
            .once('value');
            searchRef.forEach(member => {
                if(size >= start) {
                    let course = member.toJSON();
                    page.push({
                        id: member.key,
                        title: course.name,
                        description: course.description,
                        instructor: course.instructor_id,
                        size: course.size,
                        MAX_SIZE: course.MAX_SIZE,
                        endEnrollDate: course.endEnrollDate,
                        category: course.category,
                        isOpen: course.isOpen,
                    });
                    counter++;
                    if(counter >= 10) throw "page filled!";
                } else {
                    size++;
                }
            });
            size = searchRef.numChildren();
        } catch(err) {
            console.error(err);
        }
        for(let i = 0; i < page.length - 1; i++) {
            page[i].instructor = (userService.getInstructor(page[i].instructor)).name;
        }
        page[page.length - 1].instructor = (await userService.getInstructor(page[page.length - 1].instructor)).name;
        console.log(page);
        return {
            courses: page,
            size: size,
        };
    }

    async getAdminCourses(user) {
        let payload = [];
        try {
            let courses;
            console.log(user);
            if(user.auth < 3) {
                if(user.auth > 0){
                    console.log('admin');
                    courses = await database.ref('/courses')
                        .orderByChild('instructor_id')
                        .once('value');
                } else {
                    console.log('instructor');
                    courses = await database.ref('/courses')
                        .orderByChild('instructor_id')
                        .equalTo(user.id)
                        .once('value');
                }
            } else {
                console.log('Not an Instructor');
            }
            courses.forEach( (member) => {
                payload.push({
                    id: member.key,
                    name: member.child('name').val(),
                    instructor: member.child('instructor_id').val(),
                    category: member.child('category').val(),
                });
            });
        } catch(err) {
            console.error(err);
        }
        return payload;
    }

    async canRegister(student, course) {
        try {
            let ref = await database.ref('/students/' + student + '/enrolled').child(course).once('value');
            if(ref.exists()) return {stat: false, message: 'Already in class!'};
            ref = await database.ref('/courses/' + course).once('value');
            if(ref.child('/registered').hasChild(student)) return {stat: false, message: 'Already registered!'};
            if(ref.child('/waiting-list').hasChild(student)) return {stat: false, message: 'Already in waiting-list!'};
        } catch(err) {
            console.error(err);
            return {stat: false, message: 'Error!'};
        }
        return {stat: true, message: ''};
    }

    async RemoveCourse(course) {
        try {

            await database.ref('/courses/' + course).remove();

        } catch(err) {
            console.log(err);
            return false;
        }
        return true;
    }

    async canRegister(student, course) {
        try {
            let ref = await database.ref('/students/' + student + '/enrolled').child(course).once('value');
            if(ref.exists()) return {stat: false, message: 'Already in class!'};
            ref = await database.ref('/courses/' + course).once('value');

            if(ref.child('/registered').hasChild(student)) return {stat: false, message: 'Already registered!'};
            if(ref.child('/waiting-list').hasChild(student)) return {stat: false, message: 'Already in waiting-list!'};
        } catch(err) {
            console.error(err);
            return {stat: false, message: 'Error!'};
        }

        return {stat: true, message: ''};
    }
}

module.exports = new CoursesService();
