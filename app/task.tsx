"use client";

import {
  AddIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { TaskContext } from "./context";
import { Field, Form, Formik } from "formik";
import useDownloader from "react-use-downloader";

export interface Task {
  name: string;
  impact: number;
  levelOfEffort: number;
  priority?: number;
}

function validateName(value: string) {
  let error;
  if (!value) {
    error = "Name is required";
  }
  return error;
}
function validateImpact(value: number) {
  let error;
  if (!value) {
    error = "Impact is required";
  } else if (value < 1 || value > 5) {
    error = "Impact must be between 1 and 5";
  }
  return error;
}
function validateLevelOfEffort(value: number) {
  let error;
  if (!value) {
    error = "Level of Effort is required";
  } else if (value < 1 || value > 5) {
    error = "Level of Effort must be between 1 and 5";
  }
  return error;
}

export const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  function deleteTask(task: Task) {
    if (!tasks) {
      return;
    }
    let newTasks = tasks.filter((t) => t.name !== task.name);
    setTasks(newTasks);
  }

  return (
    <>
      <TaskContext.Provider value={{ tasks, setTasks }}>
        {tasks.length === 0 ? (
          <Box className="flex flex-col justify-center items-center">
            <p>No Tasks.</p>
            <AddTaskButton />
          </Box>
        ) : (
          <>
            <Box bgColor="brand.brown" borderRadius="lg" boxShadow="lg">
              <TableContainer>
                <Table variant="unstyled">
                  <TableCaption>
                    <div className="flex justify-evenly">
                      <AddTaskButton />
                      <DownloadButtons />
                    </div>
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th textAlign="center">Name</Th>
                      <Th textAlign="center" isNumeric>
                        Impact
                      </Th>
                      <Th textAlign="center" isNumeric>
                        Level of Effort
                      </Th>
                      <Th textAlign="center">Priority</Th>
                      <Th>Editing</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks
                      .sort((a: Task, b: Task) => {
                        return b.priority! - a.priority!;
                      })
                      .map((task) => (
                        <Tr key={task.name}>
                          <Td>{task.name}</Td>
                          <Td textAlign="center" isNumeric>
                            {task.impact}
                          </Td>
                          <Td textAlign="center" isNumeric>
                            {task.levelOfEffort}
                          </Td>
                          <Td textAlign="center" isNumeric>
                            {task.priority?.toFixed(2)}
                          </Td>
                          <Td>
                            <EditTaskButton task={task} />
                            <DeleteIcon
                              _hover={{ cursor: "pointer" }}
                              onClick={() => {
                                deleteTask(task);
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </TaskContext.Provider>
    </>
  );
};

const AddTaskButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tasks, setTasks } = useContext(TaskContext);

  function addTask(task: Task) {
    if (!tasks) {
      setTasks([task]);
      onClose();
      return;
    }
    let newTasks: Task[] = [...tasks, task];
    setTasks(newTasks);
    onClose();
  }

  return (
    <>
      <Button leftIcon={<AddIcon />} onClick={onOpen}>
        Add Task
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "", impact: 1, levelOfEffort: 1 }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  addTask({
                    name: values.name,
                    impact: values.impact,
                    levelOfEffort: values.levelOfEffort,
                    priority: values.impact / values.levelOfEffort,
                  });
                  actions.setSubmitting(false);
                }, 500);
              }}
            >
              {(props) => (
                <Form>
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Name</FormLabel>
                        <Input {...field} placeholder="Dishes" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="impact" validate={validateImpact}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.impact && form.touched.impact}
                      >
                        <FormLabel>Impact</FormLabel>
                        <Input {...field} placeholder="1" />
                        <FormErrorMessage>
                          {form.errors.impact}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="levelOfEffort" validate={validateLevelOfEffort}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.levelOfEffort &&
                          form.touched.levelOfEffort
                        }
                      >
                        <FormLabel>Level of Effort</FormLabel>
                        <Input {...field} placeholder="1" />
                        <FormErrorMessage>
                          {form.errors.levelOfEffort}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button mt={4} isLoading={props.isSubmitting} type="submit">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditTaskButton = (props: { task: Task }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tasks, setTasks } = useContext(TaskContext);

  function editTask(task: Task) {
    if (!tasks) {
      return;
    }

    let storedTaskIndex = tasks.indexOf(props.task);
    tasks[storedTaskIndex] = {
      name: task.name,
      impact: task.impact,
      levelOfEffort: task.levelOfEffort,
      priority: task.impact / task.levelOfEffort,
    };
    setTasks([...tasks]);
    onClose();
  }

  return (
    <>
      <EditIcon
        _hover={{ cursor: "pointer" }}
        className="mr-2"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                name: props.task.name,
                impact: props.task.impact,
                levelOfEffort: props.task.levelOfEffort,
              }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  editTask({
                    name: values.name,
                    impact: values.impact,
                    levelOfEffort: values.levelOfEffort,
                    priority: values.impact / values.levelOfEffort,
                  });
                  actions.setSubmitting(false);
                }, 500);
              }}
            >
              {(props) => (
                <Form>
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Name</FormLabel>
                        <Input {...field} placeholder="Dishes" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="impact" validate={validateImpact}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.impact && form.touched.impact}
                      >
                        <FormLabel>Impact</FormLabel>
                        <Input {...field} placeholder="1" />
                        <FormErrorMessage>
                          {form.errors.impact}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="levelOfEffort" validate={validateLevelOfEffort}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.levelOfEffort &&
                          form.touched.levelOfEffort
                        }
                      >
                        <FormLabel>Level of Effort</FormLabel>
                        <Input {...field} placeholder="1" />
                        <FormErrorMessage>
                          {form.errors.levelOfEffort}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button mt={4} isLoading={props.isSubmitting} type="submit">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

function DownloadButtons() {
  const { tasks } = useContext(TaskContext);
  const { download } = useDownloader();

  function createCSV(tasks: Task[]) {
    const keys = Object.keys(tasks[0]);

    const headerRow = keys.join(",");

    const dataRows = tasks.map((task) => {
      return keys.map((key) => task[key as keyof Task]).join(",");
    });

    const csv = [headerRow, ...dataRows].join("\n");

    return csv;
  }

  function handleDownload() {
    const csv = createCSV(tasks);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    download(url, "priorities.csv");
  }

  return (
    <>
      <Button leftIcon={<DownloadIcon />} onClick={() => handleDownload()}>
        Download CSV Report
      </Button>
    </>
  );
}
