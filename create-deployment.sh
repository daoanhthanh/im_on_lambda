FUNCTION_NAME=im_node_arm

# if [[ -z $FUNCTION_NAME ]]; then
#   echo "Please provide the lambda function name you want to deploy"
#   exit 1
# fi

# zip -r lambda_code.zip ./node_modules *.js ./package.json ./imagemagick

# zip -r lambda_code.zip ./ \
#   -x "*.sh" \
#   -x "*.zip" \
#   -x ".DS_Store" \
#   -x "./bun.lockb" \
#   -x "./package-lock.json" \
#   -x ".idea/*" \
#   -x "imagemagick/*" \
#   -x ".git/*" \
#   -x ".code/*" \
#   -x "img/*"

# if [[ $2 == "-w" ]]; then
#   echo "Creating lambda layer...."
#   cd imagemagick && zip -r ../lambda_layer.zip ./ && cd ../
# fi

# echo "function name $FUNCTION_NAME"

aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://Archive.zip
