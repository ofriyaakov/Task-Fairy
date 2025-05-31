import db from "../config/db";
import {
  Task,
  RawTask,
  RawEmployeedTask,
  RawTaskWithUserId,
} from "../models/task";
import { User } from "../models/user";
import { getAllEmployeesByCompanyIdAndGender } from "./user";
import { City } from "country-state-city";
import haversine from "haversine-distance";
import {
  increaseHolidayCountForUser,
  increaseBalancePointsForUsers,
} from "./user";
import { isHolidayOrSaturday } from "../utils/help";
import { officeTitle } from "../../consts";

type SpacingMap = { [userId: string]: number };

type Coordinates = {
  lat: number;
  lon: number;
};

export const createTask = async (task: Task) => {
  try {
    const {
      name,
      description,
      startTime,
      endTime,
      gender,
      location,
      balancePoints,
      employeesAmount,
      saveToTasks,
      other,
      companyId,
    }: Task = task;

    const query = `
        INSERT INTO tasks (name, description, start_time, end_time, gender, location, balance_points, employees_amount, save_to_tasks, other, company_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

    const values = [
      name,
      description,
      startTime,
      endTime,
      gender,
      location,
      balancePoints,
      employeesAmount,
      saveToTasks,
      other,
      companyId,
    ];
    const { rows } = await db.query(query, values);

    return rows[0];
  } catch (e) {
    console.error(e);
  }
};

export const assignEmployees = async (
  taskId: string,
  taskDate: Date,
  taskBalancePoints: number,
  employeeIds: string[]
) => {
  try {
    const query = `
        INSERT INTO public.r_tasks_users(task_id, user_id)
	    VALUES ($1, $2)
        RETURNING *
      `;

    const returnRows = [];

    // Increase holiday count for each employee assigned to the task
    if (isHolidayOrSaturday(taskDate)) {
      await increaseHolidayCountForUser(employeeIds);
    }

    // Increase balance points for each employee assigned to the task
    await increaseBalancePointsForUsers(employeeIds, taskBalancePoints);

    employeeIds.forEach(async (id) => {
      const { rows } = await db.query(query, [taskId, id]);
      returnRows.push(rows);
    });

    return returnRows;
  } catch (e) {
    console.error(e);
  }
};

export const getTaskById = async (taskId: string) => {
  try {
    const query = `
      SELECT * FROM public.tasks
      WHERE task_id = $1
    `;

    const { rows } = await db.query(query, [taskId]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      startTime: new Date(row.start_time),
      endTime: new Date(row.end_time),
      gender: row.gender,
      location: row.location,
      balancePoints: row.balance_points,
      employeesAmount: row.employees_amount,
      saveToTasks: row.save_to_tasks,
      other: row.other,
    };
  } catch (e) {
    console.error("Error fetching task by ID:", e);
    throw e;
  }
};

export const getAllSavedTasks = async () => {
  try {
    const result = await db.query(`
      SELECT * FROM public.tasks 
      WHERE save_to_tasks`);

    const savedTasks: RawTask[] = result.rows;

    const formatedSavedTasks = savedTasks.map((task) => {
      return {
        name: task.name,
        location: task.location,
        startTime: task.start_time,
        endTime: task.end_time,
        balancePoints: task.balance_points,
        gender: task.gender,
        taskId: task.task_id,
      };
    });

    return formatedSavedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getTasksByEmployeeId = async (employeeId: string) => {
  try {
    const result = await db.query(
      `SELECT t.* FROM public.tasks t
       JOIN public.r_tasks_users rtu ON t.task_id = rtu.task_id
       WHERE rtu.user_id = $1`,
      [employeeId]
    );

    const savedTasks = result.rows;

    const formattedTasks = savedTasks.map((task) => ({
      name: task.name,
      location: task.location,
      startTime: task.start_time,
      endTime: task.end_time,
      balancePoints: task.balance_points,
      gender: task.gender,
      taskId: task.task_id,
    }));

    return formattedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getAllTasksBalancePoints = async (companyId: string) => {
  try {
    const result = await db.query(
      `
        SELECT * FROM public.tasks 
        WHERE company_id = $1`,
      [companyId]
    );

    const tasks: RawTask[] = result.rows;
    const formatedTasks = tasks.map((task) => {
      return {
        name: task.name,
        balancePoints: task.balance_points,
      };
    });
    return formatedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getAllTasksByMonth = async (userId: string, month: number, companyId: number) => {
  try {
    const result = await db.query(
      `
      SELECT tasks.*,
       TO_CHAR(start_time AT TIME ZONE 'Asia/Jerusalem', 'YYYY-MM-DD') as date,
       MAX(CASE WHEN userTask.user_id = $1 THEN 1 ELSE 0 END) as is_me_assigned,
       COUNT(userTask.user_id) as assigned_employees_amount
      FROM public.tasks as tasks
      Left Join public.r_tasks_users as userTask
	      ON userTask.task_id = tasks.task_id
      WHERE EXTRACT(MONTH FROM CAST(start_time as DATE)) = $2
      AND company_id = $3
      GROUP BY tasks.task_id`, 
      [userId, month, companyId]);

    const tasks: RawEmployeedTask[] = result.rows;

    const formatedTasks = tasks.map((task) => {
      return {
        name: task.name,
        location: task.location,
        startTime: task.start_time,
        endTime: task.end_time,
        balancePoints: task.balance_points,
        gender: task.gender,
        taskId: task.task_id,
        date: task.date,
        isAssignedToCurrentUser: task.is_me_assigned === 1 ? true : false,
        employeesAmount: task.employees_amount,
        assignedEmployeesAmount: Number(task.assigned_employees_amount),
      };
    });

    return formatedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getBalancePointsByGroupForCurrentMonth = async (
  companyId: number
) => {
  try {
    const result = await db.query(
      `SELECT tasks.*, users.user_id
       FROM public.tasks
       INNER JOIN public.r_tasks_users ON tasks.task_id = r_tasks_users.task_id
       INNER JOIN public.users ON r_tasks_users.user_id = users.user_id
       INNER JOIN public.groups ON users.group_id = groups.group_id AND groups.company_id = $1
       WHERE tasks.start_time >= date_trunc('month', current_date)
       AND tasks.start_time < date_trunc('month', current_date) + interval '1 month'
       `,
      [companyId]
    );

    const tasks: RawTaskWithUserId[] = result.rows;

    const usersAmountData = await db.query(
      `SELECT COUNT(*) FROM public.users 
      INNER JOIN public.groups ON users.group_id = groups.group_id
      AND groups.company_id = $1`,
      [companyId]
    );

    const usersAmount = parseInt(usersAmountData.rows[0].count, 10);

    const balancePointsByUser: { [key: string]: number } = {};
    tasks.forEach((task) => {
      const userId = task.user_id;
      const balancePoints = task.balance_points;

      if (balancePointsByUser[userId]) {
        balancePointsByUser[userId] += balancePoints;
      } else {
        balancePointsByUser[userId] = balancePoints;
      }
    });
    const balancePointsArray = Object.values(balancePointsByUser);

    const maxBalancePoints = Math.max(...balancePointsArray);
    let minBalancePoints = 0;
    if (balancePointsByUser.length === usersAmount) {
      minBalancePoints = Math.min(...balancePointsArray);
    }
    const avgBalancePoints =
      balancePointsArray.reduce((acc, val) => acc + val, 0) / usersAmount || 0;

    return {
      max: maxBalancePoints,
      min: minBalancePoints,
      avg: avgBalancePoints,
    };
  } catch (err) {
    console.error(err);
  }
};

const getTaskDetails = async (taskId: string) => {
  try {
    const result = await db.query(
      `SELECT * FROM public.tasks WHERE task_id = $1`,
      [taskId]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};

const getClosestTaskForEmployee = async (
  employeeId: string,
  newTaskDate: Date
) => {
  try {
    const result = await db.query(
      `SELECT * FROM public.tasks t
       JOIN public.r_tasks_users rtu ON t.task_id = rtu.task_id
       WHERE rtu.user_id = $1 AND t.start_time > $2
       ORDER BY t.start_time ASC LIMIT 1`,
      [employeeId, newTaskDate]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};

async function getSpacingValues(
  taskDate: Date,
  employees: User[]
): Promise<SpacingMap> {
  const spacingValues: SpacingMap = {};

  for (const employee of employees) {
    const closestTask = await getClosestTaskForEmployee(
      employee.user_id,
      taskDate
    );

    if (closestTask?.end_time) {
      const closestTaskDate = new Date(closestTask.end_time);
      const spacingInMilliseconds = Math.abs(
        taskDate.getTime() - closestTaskDate.getTime()
      );
      const spacingInHours = spacingInMilliseconds / (1000 * 60 * 60);
      spacingValues[employee.user_id] = spacingInHours + 1;
    } else {
      spacingValues[employee.user_id] = 1;
    }
  }

  return spacingValues;
}

function normalizeValues(
  values: Record<string, number>,
  toMin = 0,
  toMax = 1
): Record<string, number> {
  const entries = Object.entries(values);
  if (entries.length === 0) return {};

  const nums = entries.map(([, v]) => v);
  const fromMin = Math.min(...nums);
  const fromMax = Math.max(...nums);
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;

  if (fromRange === 0) {
    return Object.fromEntries(entries.map(([k]) => [k, toMin]));
  }

  return Object.fromEntries(
    entries.map(([k, v]) => [k, ((v - fromMin) / fromRange) * toRange + toMin])
  );
}

export const getSuggestedEmployees = async (taskId: string) => {
  const weights = {
    employeeBalancePoint: 0.3,
    groupBalancePoint: 0.1,
    distance: 0.3,
    saturdayAndHoliday: 0.1,
    spacing: 0.2,
  };

  const taskDetails = await getTaskDetails(taskId);
  const taskDate = new Date(taskDetails.start_time);
  const taskGender = taskDetails.gender;
  const taskLocation = taskDetails.location;
  const taskCompanyId = taskDetails.company_id;
  const taskEmployeeAmount = taskDetails.employees_amount;

  const allEmployees = await getAllEmployeesByCompanyIdAndGender(
    taskCompanyId,
    taskGender
  );

  let balancePointsByGroup = allEmployees.reduce(
    (acc: { [key: string]: number }, employee) => {
      if (employee.group_id) {
        if (!acc[employee.group_id]) {
          acc[employee.group_id] = 1;
        }
        acc[employee.group_id] += employee.balance_points;
      }
      return acc;
    },
    {}
  );

  let employeeBalancePointValues = allEmployees.reduce(
    (acc: { [key: string]: number }, employee) => {
      acc[employee.user_id] = 1 + employee.balance_points;
      return acc;
    },
    {}
  );

  let groupBalancePointValues = allEmployees.reduce(
    (acc: { [key: string]: number }, employee) => {
      acc[employee.user_id] = balancePointsByGroup[employee.group_id] || 1;
      return acc;
    },
    {}
  );

  let saturdayAndHolidayValues = allEmployees.reduce(
    (acc: { [key: string]: number }, employee) => {
      acc[employee.user_id] = parseInt(employee.holiday_count) + 1;
      return acc;
    },
    {}
  );

  const taskLocationObj =
    taskLocation !== officeTitle
      ? City.getCitiesOfCountry("IL").find((c) => c.name === taskLocation)
      : null;
  const taskLocationCoordinates: Coordinates | null = taskLocationObj
    ? {
        lat: parseFloat(taskLocationObj.latitude),
        lon: parseFloat(taskLocationObj.longitude),
      }
    : null;

  const distanceValues = allEmployees.reduce<Record<string, number>>(
    (acc, employee) => {
      if (taskLocationObj) {
        const employeeCityObj = City.getCitiesOfCountry("IL").find(
          (c) => c.name === employee.city
        );

        if (employeeCityObj) {
          const employeeCityCoordinates = {
            lat: parseFloat(employeeCityObj.latitude),
            lon: parseFloat(employeeCityObj.longitude),
          };
          acc[employee.user_id] =
            haversine(taskLocationCoordinates, employeeCityCoordinates) / 1000 +
            1;
        } else {
          acc[employee.user_id] = 1;
        }
      } else {
        acc[employee.user_id] = 1;
      }
      return acc;
    },
    {}
  );

  let spacingValues = await getSpacingValues(taskDate, allEmployees);

  let employeeBalancePointsNormalized = normalizeValues(
    employeeBalancePointValues,
    0,
    1
  );
  let groupBalancePointValuesNormalized = normalizeValues(
    groupBalancePointValues,
    0,
    1
  );
  let distanceValuesNormalized = normalizeValues(distanceValues, 0, 1);
  let saturdayAndHolidayValuesNormalized = normalizeValues(
    saturdayAndHolidayValues,
    0,
    1
  );
  let spacingValuesNormalized = normalizeValues(spacingValues, 0, 1);

  let employeeScores: { [key: string]: number } = {};
  allEmployees.forEach((employee) => {
    const employeeId = employee.user_id;
    const employeeScore =
      weights.employeeBalancePoint *
        (1 - employeeBalancePointsNormalized[employeeId]) +
      weights.groupBalancePoint *
        (1 - groupBalancePointValuesNormalized[employeeId]) +
      weights.distance * distanceValuesNormalized[employeeId] +
      weights.saturdayAndHoliday *
        saturdayAndHolidayValuesNormalized[employeeId] +
      weights.spacing * spacingValuesNormalized[employeeId];

    employeeScores[employeeId] = employeeScore * 100; // Scale to 0-100
  });

  const allScores = Object.values(employeeScores);

  const maxScore = Math.max(...allScores);
  if (maxScore < 70) {
    const offset = 30;
    for (const id in employeeScores) {
      employeeScores[id] = Math.min(employeeScores[id] + offset, 100);
    }
  }

  const entries = Object.entries(employeeScores);

  const sortedEntries = entries.sort(
    ([, scoreA], [, scoreB]) => scoreB - scoreA
  );

  const employeeById: { [key: string]: (typeof allEmployees)[0] } =
    Object.fromEntries(allEmployees.map((e) => [e.user_id.toString(), e]));

  const maxSuggestions = taskEmployeeAmount > 4 ? taskEmployeeAmount * 2 : 10;
  const take = Math.min(sortedEntries.length, maxSuggestions);

  const topEmployees = sortedEntries.slice(0, take).map(([user_id, score]) => {
    const emp = employeeById[user_id];
    return {
      ...emp,
      score,
    };
  });

  return topEmployees;
};

export const getAssignedEmployees = async (taskId: string) => {
  try {
    const result = await db.query(
      `SELECT users.*, groups.group_name, companies.company_name
       FROM public.users as users
       JOIN public.r_tasks_users AS userTask
        ON users.user_id = userTask.user_id
       JOIN public.tasks AS tasks 
        ON userTask.task_id = tasks.task_id
       JOIN public.groups as groups
        ON users.group_id = groups.group_id
       JOIN public.companies as companies
        ON groups.company_id = companies.company_id
       WHERE userTask.task_id = $1`,
      [taskId] 
    );
    return result.rows;
  } catch (err) {
    console.error(err);
  }
}

export const getUnassignedTasksAmount = async (companyId: number) => {
  try {
    const result = await db.query(`
      SELECT (
        SELECT SUM(employees_amount)
        FROM public.tasks
        WHERE company_id = $1 AND EXTRACT(MONTH FROM CAST(start_time as DATE)) = EXTRACT(MONTH FROM CAST(current_date as DATE))
        ) - (
        SELECT COUNT(r_tasks_users.id)
        FROM public.r_tasks_users
        JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
        WHERE tasks.company_id = $1 AND EXTRACT(MONTH FROM CAST(tasks.start_time as DATE)) = EXTRACT(MONTH FROM CAST(current_date as DATE))
      ) as amount 
      `, [companyId]
    );
    const amount: number = result.rows[0];
    return amount;

  } catch (err) {
    console.error(err);
  }
};

export const getAvgTasksPerWeek = async (companyId: number) => {
  try {
    const result = await db.query(`
      SELECT AVG(tasks_amount_by_week)
      FROM (
        SELECT COUNT(task_id) AS tasks_amount_by_week
        FROM public.tasks
        WHERE company_id = $1 AND EXTRACT(MONTH FROM CAST(start_time as DATE)) = EXTRACT(MONTH FROM CAST(current_date as DATE))
        GROUP BY DATE_TRUNC('week', start_time)
      )`, [companyId]
    );
    const avg: number = result.rows[0];
    return avg;

  } catch (err) {
    console.error(err);
  }
};