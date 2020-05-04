from locust import HttpLocust, TaskSet, task, constant_pacing

class WebsiteTasks(TaskSet):
    @task
    def send_post_req(self):
        self.client.post("/api", {
            "payload1": "1234567",
            "payload2": "7654321"
        })

class WebsiteUser(HttpLocust):
    task_set = WebsiteTasks
    # wait_time = between(3, 5)
    wait_time = constant_pacing(0.8)
