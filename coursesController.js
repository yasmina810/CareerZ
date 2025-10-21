// coursesController
import { getCourse,getCourseById,searchCourses,addCourse } from "../model/courseModel.js";

export async function getAllCourses(req, res) {
    try {
        const courses = await getCourse();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getCourseByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error while fetching course" });
  }
};

export async function searchCoursesController(req, res) {
    try {
        const keyword = req.query.keyword;
        if (!keyword) return res.status(400).json({ message: "Keyword is required" });
        const courses = await searchCourses(keyword);
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function createCourse(req,res) {
    try {
        const { title, description, price, hours, level, career_id } = req.body;
        const mentor_id = req.user_id
        const image = req.file ? req.file.path : null;

        if(!title || !description || !price || !hours || !career_id){
            return res.status(400).json({message:"Missing required fields"})
        }

        const course_id = await addCourse({
            title,
            description,
            price,
            hours,
            image,
            mentor_id,
            career_id,
            level
        })

        res.status(201).json({
            message: "Course added successfully",
            course_id: course_id
        })
    } catch (error) {
        console.error("error adding a new course",error)
        res.status(500).json({message: "server error"})
    }
}
