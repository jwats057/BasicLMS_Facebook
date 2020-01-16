import { CourseDetailEditorComponent } from './../../courses/course/info/course-detail-editor/course-detail-editor.component';
import { YesNoDialogComponent } from './../../yes-no-dialog/yes-no-dialog.component';
import { NewcourseComponent } from './../../nav/newcourse/newcourse.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CoursesService } from 'src/app/services/courses.service';

interface Course {
  category: string;
  id: string;
  instructor: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.scss']
})
export class ManageCoursesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'instructor', 'category', 'actions'];
  courses: Course[] = [];
  loading = false;

  constructor(
    private userServices: UserService,
    private coursesServices: CoursesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true;
    this.coursesServices.getAdminCourses().subscribe( (resp: Course[]) => {
      this.courses = resp;
      this.courses.forEach( course => {
        this.coursesServices.getInstructorInfo(course.instructor).subscribe((inst: {contactEmail: string, name: string}) => {
          course.instructor = inst.name;
          course.email = inst.contactEmail;
          this.loading = false;
        });
      });
    });
  }

  openAddCourseDialog() {
    const dialogRef = this.dialog.open(NewcourseComponent, {
      width: '90%',
      data: {
        name: 'Insert Course Title Here',
        description: 'Enter Course description here'
      }
    });
    dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  removeCourse(course) {
    const YesNoRef = this.dialog.open(YesNoDialogComponent, {
      width: '90%',
      data: {
        title: 'Warning!',
        message: 'Do you really want to delete this course?\n This action cannot be undone.',
      }
    });

    YesNoRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.loading = true;
        this.coursesServices.removeCourse(course).subscribe(response => {
          if (response) {
            console.log('course removed!');
            this.courses.splice(this.courses.indexOf(course), 1);
          }
          this.loading = false;
        });
        console.log('deleting course', course);
      }
    });
  }

  openEditCourse(courseId) {
    this.coursesServices.getCourseInfo(courseId)
        .subscribe( (course: {id: string, name: string,
          description: string, instructor: string, students: string[]}) => {
          const dialogRef = this.dialog.open(CourseDetailEditorComponent, {
            width: '90%',
            data: course
          });
          dialogRef.afterClosed().subscribe( (result) => {
            if (result) {
              console.log(result);
              this.ngOnInit();
            }
          });
    });
  }
}
