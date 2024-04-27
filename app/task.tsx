"use client";

import {
  AddIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
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
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { TaskContext } from "./context";
import { Field, Form, Formik } from "formik";
import useDownloader from "react-use-downloader";

export interface Task {
  name: string;
  impact: Impact;
  levelOfEffort: LevelOfEffort;
  priority?: number;
}

enum Impact {
  Low = 1,
  Minor = 2,
  Moderate = 3,
  Signifant = 4,
  Critical = 5,
}

enum LevelOfEffort {
  Minimal = 1,
  Low = 2,
  Moderate = 3,
  High = 4,
  Maximum = 5,
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
  }
  return error;
}
function validateLevelOfEffort(value: number) {
  let error;
  if (!value) {
    error = "Level of Effort is required";
  }
  return error;
}

const OverflownText = ({ children, ...props }: { children: string }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isOverflown, setIsOverflown] = useState(false);

  useEffect(() => {
    const element = ref.current!;
    if (!element) {
      return;
    }
    setIsOverflown(element.scrollWidth > element.clientWidth);
  }, []);

  return (
    <Flex minW="0" justifyContent="center">
      <Box overflow="hidden">
        <Tooltip label={children} isDisabled={!isOverflown}>
          <Text isTruncated maxW="10rem" ref={ref} {...props}>
            {children}
          </Text>
        </Tooltip>
      </Box>
    </Flex>
  );
};

export const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
                      <DownloadButton />
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
                      <Th textAlign="center">
                        <p className="flex justify-center items-center">
                          Priority
                          <Tooltip
                            hasArrow
                            label="Calculated by impact / level of effort."
                          >
                            <QuestionOutlineIcon className="ml-1" />
                          </Tooltip>
                        </p>
                      </Th>
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
                          <Td textAlign="center">
                            <OverflownText>{task.name}</OverflownText>
                          </Td>
                          <Td textAlign="center">{Impact[task.impact]}</Td>
                          <Td textAlign="center" isNumeric>
                            {LevelOfEffort[task.levelOfEffort]}
                          </Td>
                          <Td textAlign="center" isNumeric>
                            {task.priority?.toFixed(2)}
                          </Td>
                          <Td>
                            <EditTaskButton task={task} />
                            <DeleteTaskButton task={task} />
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

const DeleteTaskButton = (props: { task: Task }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const { tasks, setTasks } = useContext(TaskContext);

  function deleteTask(task: Task) {
    if (!task || !tasks) {
      return;
    }
    let newTasks = tasks.filter((t) => t.name !== task.name);
    setTasks(newTasks);
  }

  return (
    <>
      <DeleteIcon onClick={onOpen} _hover={{ cursor: "pointer" }} />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete task `{props.task.name}`? You
              can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteTask(props.task);
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
              initialValues={{
                name: "",
                impact: Impact.Low,
                levelOfEffort: LevelOfEffort.Minimal,
              }}
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
                        <FormLabel>
                          Impact
                          <Tooltip
                            hasArrow
                            label="What impact will this task have if completed?"
                          >
                            <QuestionOutlineIcon className="pl-1" />
                          </Tooltip>
                        </FormLabel>
                        <Select {...field}>
                          <option value="1">Low</option>
                          <option value="2">Minor</option>
                          <option value="3">Moderate</option>
                          <option value="4">Significant</option>
                          <option value="5">Critical</option>
                        </Select>
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
                        <FormLabel>
                          Level of Effort
                          <Tooltip
                            hasArrow
                            label="How much effort will the task need to complete?"
                          >
                            <QuestionOutlineIcon className="pl-1" />
                          </Tooltip>
                        </FormLabel>
                        <Select {...field}>
                          <option value="1">Minimal</option>
                          <option value="2">Low</option>
                          <option value="3">Moderate</option>
                          <option value="4">High</option>
                          <option value="5">Maximum</option>
                        </Select>
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
                        <FormLabel>
                          Impact
                          <Tooltip
                            hasArrow
                            label="What impact will this task have if completed?"
                          >
                            <QuestionOutlineIcon className="pl-1" />
                          </Tooltip>
                        </FormLabel>
                        <Select {...field}>
                          <option value="1">Low</option>
                          <option value="2">Minor</option>
                          <option value="3">Moderate</option>
                          <option value="4">Significant</option>
                          <option value="5">Critical</option>
                        </Select>
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
                        <FormLabel>
                          Level of Effort
                          <Tooltip
                            hasArrow
                            label="How much effort will the task need to complete?"
                          >
                            <QuestionOutlineIcon className="pl-1" />
                          </Tooltip>
                        </FormLabel>
                        <Select {...field}>
                          <option value="1">Minimal</option>
                          <option value="2">Low</option>
                          <option value="3">Moderate</option>
                          <option value="4">High</option>
                          <option value="5">Maximum</option>
                        </Select>
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

function DownloadButton() {
  const { tasks } = useContext(TaskContext);
  const { download } = useDownloader();

  function createCSV(tasks: Task[]) {
    if (!tasks) {
      return "";
    }

    const keys = Object.keys(tasks[0]);

    const headerRow = keys.join(",");

    const dataRows = tasks.map((task) => {
      // Replace commas in task names with spaces
      // this prevents the csv from being weird
      let taskName = task.name;
      task.name = task.name.replaceAll(",", " ");
      let myKeys = keys.map((key) => task[key as keyof Task]).join(",");
      // Put the original task name back for UI
      task.name = taskName;
      return myKeys;
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
