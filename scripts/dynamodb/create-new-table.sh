aws \
  --endpoint-url=http://localhost:4566 \
  dynamodb create-table --table-name chat \
  --attribute-definitions \
   AttributeName=pk,AttributeType=S \
   AttributeName=sk,AttributeType=S \
  --key-schema \
   AttributeName=pk,KeyType=HASH \
   AttributeName=sk,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --stream-specification StreamEnabled=TRUE,StreamViewType=NEW_AND_OLD_IMAGES \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-index \
  "[{\"IndexName\": \"reverse\",\"KeySchema\":[{\"AttributeName\":\"sk\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"pk\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\": 5,\"WriteCapacityUnits\": 5}}]"

