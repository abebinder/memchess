echo "Deploy app $1 branch $2"
JOB_ID=$(aws amplify start-job --app-id $1 --branch-name $2 --job-type RELEASE | jq -r '.jobSummary.jobId')
echo "Release started"
echo "Job ID is $JOB_ID"

#having condition at the end forces loop to be entered at least once
while
     sleep 1;
     RESULTS=$(aws amplify get-job --app-id $1 --branch-name $2 --job-id $JOB_ID)
     JOB_STATUS="$(echo $RESULTS | jq -r '.job.summary.status')"
     echo "Job status is $JOB_STATUS"
     [[ "$JOB_STATUS" =~ ^(PENDING|RUNNING|CANCELLING)$ ]]
do true; done
echo "Job finished, results:"
echo "$RESULTS"
echo "Job status is $JOB_STATUS"
if [ "$JOB_STATUS" != "SUCCEED" ]; then
    echo "Deployment did not succeed"
    exit 1
fi
echo "Deployment succeeded"
